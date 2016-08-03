import IValidatableRule from "../interface/IValidatableRule";
import * as ko from 'knockout';
import RuleType from "./RuleType";
import * as some from 'lodash/some';
import * as every from 'lodash/every';
import * as find from 'lodash/find';
import Disposable from "seng-disposable";
import {SingleRuleFunction} from "./RuleBindingValue";
import scheduleKoResolve from "../utils/scheduleKoResolve";

export default class RuleState extends Disposable implements IValidatableRule {
	public /*readonly*/ name:string;
	public /*readonly*/ ruleType:RuleType;
	public /*readonly*/ isValid:ko.PureComputed<boolean>;
	public /*readonly*/ isValidated:ko.PureComputed<boolean>;
	public /*readonly*/ isValidating:ko.PureComputed<boolean>;
	public /*readonly*/ test:any;
	private _isValid:ko.Observable<boolean>;
	private _isValidating:ko.Observable<number>;
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
			this.isValidated = ko.pureComputed(
				() => every(<Array<RuleState>> this.test, rule => rule.isValidated())
			).extend({deferred : true});
			this.isValidating = ko.pureComputed(
				() => some(<Array<RuleState>> this.test, rule => rule.isValidating())
			).extend({deferred : true});
			this.isValid = ko.pureComputed({
				read : () => every(<Array<RuleState>> this.test, rule => rule.isValid()),
				write : (isValid:boolean) => this.test.forEach((rule:RuleState) => rule.isValid(isValid))
			}).extend({deferred : true});
		}
		else
		{
			this._isValid = ko.observable(null);
			this._isValidating = ko.observable(0);
			this.isValidated = ko.pureComputed(() => this._isValid() !== null);
			this.isValid = ko.pureComputed({
				read : () => this._isValid(),
				write : (isValid:boolean) => this._isValid(isValid)
			});
			this.isValidating = ko.pureComputed(() => !!this._isValidating());
		}

	}

	public getRuleState(name?:string|number):IValidatableRule
	{
		if(this._isCollection)
		{
			return typeof name === 'undefined' ? this.test[0] : (find(<Array<RuleState>> this.test, rule => rule.name === name) || null);
		}
		return null;
	}

	public validate(value:any):Promise<boolean>
	{
		let validation:Promise<boolean>;
		switch(this.ruleType)
		{
			case RuleType.COLLECTION_AND:
			case RuleType.COLLECTION_OR:
				const aggregate = this.ruleType === RuleType.COLLECTION_AND ? every : some;
				return Promise.all((<Array<RuleState>> this.test).map(rule => rule.validate(value))).then((results:Array<boolean>) =>
				{
					return aggregate(results, result => !!result);
				});
			case RuleType.CHECKED:
				validation = Promise.resolve(value === this.test);
				break;
			case RuleType.FUNCTION:
				this._isValidating(this._isValidating() + 1);

				validation = Promise.resolve((<SingleRuleFunction> this.test)(value)).then(result =>
				{
					this._isValidating(Math.max(0, this._isValidating() - 1));
					return result;
				});
				break;
			case RuleType.REGEX:
				validation = Promise.resolve((typeof value === 'string') && (<RegExp> this.test).test(value));
				break;
			default:
				throw new Error(`Trying to validate rule with unknown type: ${this.ruleType}`);
		}
		return validation.then(result =>
		{
			this._isValid(result);
			return scheduleKoResolve(result);
		});
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
				(<Array<RuleState>> this.test).forEach(test => test.dispose());
			}
			this.isValid.dispose();
			this.isValidated.dispose();
			this.isValidating.dispose();
		}

		super.dispose();
	}
}

export const rulePlaceholder:RuleState = new RuleState(
	null,
	RuleType.NONE,
	() => true
);
