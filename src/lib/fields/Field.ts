import * as ko from 'knockout';
import KnockoutValidator from "../KnockoutValidator";
import parseBindingRule from "../rules/parseBindingRule";
import Disposable from "seng-disposable";
import elementMapper from "../bindings/elementMapper";
import IValidatableRule from "../interface/IValidatableRule";
import RuleType from "../rules/RuleType";
import {RuleBindingValue} from "../rules/RuleBindingValue";
import Rule from "../rules/Rule";

export default class Field extends Disposable implements IValidatableRule
{
	public readonly isValidated:ko.PureComputed<boolean>;
	public readonly isValidating:ko.PureComputed<boolean>;
	public readonly validatedValue:ko.PureComputed<any>;
	public readonly isValid:ko.PureComputed<boolean>;
	public value:ko.Observable<any>;
	public name:string;

	private _rule:ko.Observable<Rule> = ko.observable(null);
	private _validatedValue:ko.Observable<any> = ko.observable(null).extend({deferred : true});
	private _validator:KnockoutValidator;
	private _ruleBindingValue:RuleBindingValue;

	constructor(public id:string)
	{
		super();

		this.validatedValue = ko.pureComputed(() => this._validatedValue());
		this.isValidated = ko.pureComputed(() =>
		{
			const rule = this._rule();
			return rule ? rule.isValidated() : false;
		});
		this.isValidating = ko.pureComputed(() =>
		{
			const rule = this._rule();
			return rule ? rule.isValidating() : false;
		});
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
		});
	}

	public get ruleType():RuleType
	{
		const rule = this._rule();
		return rule ? rule.ruleType : RuleType.NONE;
	}

	public validate = (value?:any):Promise<boolean> =>
	{
		const rule = this._rule();
		if(!rule)
		{
			throw new Error(`Trying to validate field ${name} without a validation rule.`);
		}

		return rule.validate(typeof value === 'undefined' ? this.value() : value);
	};

	public clearValidation():void
	{
		this.isValid(false);
		this._validatedValue(null);
	}

	public rule(name?:string|number):Rule
	{
		return this._rule();
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
		elementMapper.removeField(this.id);

		super.dispose();
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

