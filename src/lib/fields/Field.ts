import * as ko from 'knockout';
import KnockoutValidator from "../KnockoutValidator";
import parseBindingRule from "../rules/parseBindingRule";
import Disposable from "seng-disposable";
import elementMapper from "../bindings/elementMapper";
import IValidatableRule from "../interface/IValidatableRule";
import RuleType from "../rules/RuleType";
import {RuleBindingValue} from "../rules/RuleBindingValue";
import Rule from "../rules/Rule";
import rulePlaceholder from "../rules/rulePlaceholder";

export default class Field extends Disposable implements IValidatableRule
{
	public /*readonly*/ isValidated:ko.PureComputed<boolean>;
	public /*readonly*/ isValidating:ko.PureComputed<boolean>;
	public /*readonly*/ validatedValue:ko.PureComputed<any>;
	public /*readonly*/ isValid:ko.PureComputed<boolean>;
	public name:string;

	private _rule:ko.Observable<Rule> = ko.observable(null);
	private _value:ko.Observable<any>;
	private _validatedValue:ko.Observable<any> = ko.observable(null).extend({deferred : true});
	private _validator:KnockoutValidator;
	private _ruleBindingValue:RuleBindingValue;
	private _validateOn:string;
	private _valueSubscriptions:Array<ko.subscription> = [];
	private _currentValidation:Promise<boolean> = null;

	constructor(public id:string)
	{
		super();

		this.validatedValue = ko.pureComputed(() => this._validatedValue());
		this.isValidated = ko.pureComputed(() =>
		{
			const rule = this._rule();
			return rule ? rule.isValidated() : false;
		}).extend({deferred : true});
		this.isValidating = ko.pureComputed(() =>
		{
			const rule = this._rule();
			return rule ? rule.isValidating() : false;
		}).extend({deferred : true});
		this.isValid = ko.pureComputed({
			read : () =>
			{
				const rule = this._rule();
				return rule ? rule.isValid() : false;
			},
			write : (isValid:boolean) =>
			{
				const rule = this._rule();
				if(rule)
				{
					rule.isValid(isValid);
				}
			}
		}).extend({deferred : true});
	}

	public get ruleType():RuleType
	{
		const rule = this._rule();
		return rule ? rule.ruleType : RuleType.NONE;
	}

	public get validateOn():string
	{
		return this._validateOn;
	}

	public set validateOn(validateOn:string)
	{
		this._validateOn = validateOn;
	}

	public get value():ko.Observable<any>
	{
		return this._value;
	}

	public set value(value:ko.Observable<any>)
	{
		this._clearValueSubscriptions();
		this._value = value;
	}

	public validate = (value?:any):Promise<boolean> =>
	{
		const rule = this._rule();
		if(!rule)
		{
			throw new Error(`Trying to validate field ${name} without a validation rule.`);
		}

		if(!this._currentValidation)
		{
			this._currentValidation = rule.validate(typeof value === 'undefined' ? this.value() : value).then(() =>
			{
				this._currentValidation = null
			});
		}

		return this._currentValidation;
	};

	public clearValidation():void
	{
		this.isValid(false);
		this._validatedValue(null);
	}

	public rule(name?:string|number):Rule
	{
		return this._rule() || rulePlaceholder;
	}

	public get ruleBindingValue():RuleBindingValue
	{
		return this._ruleBindingValue;
	}

	public set ruleBindingValue(ruleBindingValue:RuleBindingValue)
	{
		if(this._ruleBindingValue !== ruleBindingValue)
		{
			this._ruleBindingValue = ruleBindingValue;
			const currentRule = this._rule();
			if(currentRule)
			{
				currentRule.dispose();
			}
			this._currentValidation = null;
			const rule = parseBindingRule(ruleBindingValue);
			this._rule(rule);
		}
	}

	public get validator():KnockoutValidator
	{
		return this._validator;
	}

	public set validator(validator:KnockoutValidator)
	{
		if(this._validator !== validator)
		{
			this._detachFromValidator();
			this._validator = validator;

			if(validator)
			{
				validator.attachField(this);
			}
		}
	}

	public dispose():void
	{
		this._detachFromValidator();
		this._clearValueSubscriptions();
		elementMapper.removeField(this.id);

		this.isValid.dispose();
		this.isValidated.dispose();
		this.isValidating.dispose();
		this.validatedValue.dispose();
		super.dispose();
	}

	private _clearValueSubscriptions():void
	{
		this._valueSubscriptions.forEach(subscription => subscription.dispose());
		this._valueSubscriptions.length = 0;
	}

	private _detachFromValidator():void
	{
		if(this._validator)
		{
			this._validator.detachField(this);
			this._validator = null;
		}
	}
}

