import * as ko from 'knockout';
import KnockoutValidator from "../KnockoutValidator";
import {BindingRule, IValidationRule} from "../rules/rule";
import parseBindingRule from "../rules/parseBindingRule";
import Disposable from "seng-disposable";
import elementMapper from "../bindings/elementMapper";

export default class Field extends Disposable {
	public initialized:boolean = false;
	public value:ko.Observable<any>;
	private _validator:KnockoutValidator;
	private _rule:BindingRule;
	private _parsedRule:IValidationRule;

	constructor(
		public id:string
	)
	{

	}

	public get rule():BindingRule
	{
		return this._rule;
	}

	public set rule(rule:BindingRule)
	{
		this._rule = rule;
		this._parsedRule = parseBindingRule(rule);
	}

	public get validator():KnockoutValidator
	{
		return this._validator;
	}

	public set validator(validator:KnockoutValidator)
	{
		if(this._validator !== validator)
		{
			if(this._validator)
			{
				this._validator.detachField(this);
			}
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

