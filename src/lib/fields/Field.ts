import ko = require('knockout');
import KnockoutValidator from "../KnockoutValidator";
import {BindingRule, IValidationRule} from "../rules/rule";
import parseBindingRule from "../rules/parseBindingRule";

export default class Field {
	public initialized:boolean = false;
	public value:ko.Observable<any>;
	public validator:KnockoutValidator;
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
}

