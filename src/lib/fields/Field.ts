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
	public isValid:ko.Observable<boolean> = ko.observable(false);
	public value:ko.Observable<any>;
	public name:string;

	private _validator:KnockoutValidator;
	private _rule:Rule;
	private _ruleBindingValue:RuleBindingValue;
	private _validatedValue:ko.Observable<any> = ko.observable(null);

	constructor(public id:string)
	{
		super();

		this.validatedValue = ko.pureComputed(() => this._validatedValue()).extend({deferred : true});
		this.isValidated = ko.pureComputed(() => this.isValid() !== null).extend({deferred : true});
		this.isValidating = ko.pureComputed(() => () =>
		{
			// todo: aggregate rule thingies
		});
	}

	public get ruleType():RuleType
	{
		return this._rule ? this._rule.ruleType : RuleType.NONE;
	}

	public validate = ():Promise<boolean> =>
	{

		return Promise.resolve(false);
	};

	public clearValidation():void
	{
		//todo
	}

	public rule(name?:string|number):Rule
	{
		return this._rule;
	}

	public get ruleBindingValue():RuleBindingValue
	{
		return this._ruleBindingValue;
	}

	public set ruleBindingValue(rule:RuleBindingValue)
	{
		if(this._ruleBindingValue !== rule)
		{
			this._ruleBindingValue = rule;
			this._rule = parseBindingRule(rule);
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

