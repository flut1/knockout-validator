import IValidatableRule from "../interface/IValidatableRule";
import * as ko from 'knockout';
import RuleType from "./RuleType";

export default class Rule implements IValidatableRule {
	public readonly name:string;
	public readonly ruleType:RuleType;
	public readonly isValid:ko.Observable<boolean> = ko.observable(null);
	public readonly isValidated:ko.PureComputed<boolean>;
	public readonly isValidating:ko.PureComputed<boolean>;
	private _test:any;

	constructor(
		name:string,
	    ruleType:RuleType,
	    test:any
	)
	{
		this.name = name;
		this.ruleType = ruleType;
		this._test = test;

		this.isValidated = ko.computed(() => this.isValid() !== null).extend({deferred : true});
		this.isValidating = ko.computed(() => this._isValidating());
	}

	rule(name?:string|number):IValidatableRule
	{
		return null;
	}

	validate():Promise<boolean>
	{
		return null;
	}

	clearValidation():void
	{
	}
}
