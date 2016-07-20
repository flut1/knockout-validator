import IValidatableRule from "../interface/IValidatableRule";
import * as ko from 'knockout';
import RuleType from "./RuleType";
import some from 'lodash.some';
import every from 'lodash.every';
import find from 'lodash.find';
import Disposable from "seng-disposable";
import {SingleRuleFunction} from "./RuleBindingValue";

export default class Rule extends Disposable implements IValidatableRule {
	public readonly name:string;
	public readonly ruleType:RuleType;
	public readonly isValid:ko.PureComputed<boolean>;
	public readonly isValidated:ko.PureComputed<boolean>;
	public readonly isValidating:ko.PureComputed<boolean>;
	public readonly test:any;
	private _isValid:ko.Observable<boolean>;
	private _isValidating:ko.Observable<boolean>;
	private _isCollection:boolean;

	constructor(
		name:string,
	    ruleType:RuleType,
	    test:any
	)
	{
		super();
		this.name = name;
		this.ruleType = ruleType;
		this.test = test;

		this._isCollection = ruleType === RuleType.COLLECTION_AND || ruleType === RuleType.COLLECTION_OR;
		if(this._isCollection)
		{
			this.isValidated = ko.pureComputed(() => every(<Array<Rule>> this.test, rule => rule.isValidated()));
			this.isValidating = ko.pureComputed(() => some(<Array<Rule>> this.test, rule => rule.isValidating()));
			this.isValid = ko.pureComputed({
				read : () => every(<Array<Rule>> this.test, rule => rule.isValid()),
				write : (isValid:boolean) => this.test.forEach((rule:Rule) => rule.isValid(isValid))
			});
		}
		else
		{
			this._isValid = ko.observable(null).extend({deferred : true});
			this._isValidating = ko.observable(false).extend({deferred : true});
			this.isValidated = ko.pureComputed(() => this._isValid() === null);
			this.isValid = ko.pureComputed({
				read : () => this._isValid(),
				write : (isValid:boolean) => this._isValid(isValid)
			});
			this.isValidating = ko.pureComputed(() => this._isValidating());
		}

	}

	public rule(name?:string|number):IValidatableRule
	{
		if(this._isCollection)
		{
			return typeof name === 'undefined' ? this.test[0] : (find(<Array<Rule>> this.test, rule => rule.name === name) || null);
		}
		return null;
	}

	public validate(value:any):Promise<boolean>
	{
		switch(this.ruleType)
		{
			case RuleType.COLLECTION_AND:
			case RuleType.COLLECTION_OR:
				const aggregate = this.ruleType === RuleType.COLLECTION_AND ? every : some;
				return Promise.all((<Array<Rule>> this.test).map(rule => rule.validate(value))).then(
					(results:Array<boolean>) => aggregate(results, result => !!result));
			case RuleType.CHECKED:
				return Promise.resolve(value === this.test);
			case RuleType.FUNCTION:
				return Promise.resolve((<SingleRuleFunction> this.test)(value));
			case RuleType.REGEX:
				return Promise.resolve((<RegExp> this.test).test(value));
			default:
				throw new Error(`Trying to validate rule with unknown type: ${this.ruleType}`);
		}
	}

	public clearValidation():void
	{
		this.isValid(null);
	}

	public dispose():void
	{
		if(!this.isDisposed())
		{
			if(this._isCollection)
			{
				(<Array<Rule>> this.test).forEach(test => test.dispose());
			}
			this.isValid.dispose();
			this.isValidated.dispose();
			this.isValidating.dispose();
		}

		super.dispose();
	}
}
