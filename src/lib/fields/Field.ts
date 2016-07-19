import * as ko from 'knockout';
import KnockoutValidator from "../KnockoutValidator";
import {BindingRule, IValidationRule, ValidationRuleType} from "../rules/rule";
import parseBindingRule from "../rules/parseBindingRule";
import Disposable from "seng-disposable";
import elementMapper from "../bindings/elementMapper";
import FieldState from "./FieldState";
import RuleState from "../rules/RuleState";
import some from 'lodash.some';
import every from 'lodash.every';

export default class Field extends Disposable
{
	public value:ko.Observable<any>;
	public state:FieldState;
	private _validator:KnockoutValidator;
	private _rule:BindingRule;
	private _parsedRule:IValidationRule;
	private _isValidating:ko.Observable<boolean> = ko.observable(false);
	private _validatedValue:ko.Observable<any> = ko.observable(null);

	constructor(public id:string)
	{
		super();
		this._createState();
	}

	public validate = ():Promise<boolean> =>
	{

		return this._validateRule(this._parsedRule);
	};

	public getRuleState = (ruleName:string):RuleState =>
	{
		return null;
	};

	public get name():string
	{
		return this.state.name;
	}

	public set name(name:string)
	{
		this.state.name = name;
	}

	public get rule():BindingRule
	{
		return this._rule;
	}

	public set rule(rule:BindingRule)
	{
		if(this._rule !== rule)
		{
			this._rule = rule;
			this._parsedRule = parseBindingRule(rule);
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
		this._disposeState();
		elementMapper.removeField(this.id);

		super.dispose();
	}

	private _validateRule(rule:IValidationRule):Promise<boolean>
	{
		switch(rule.type)
		{
			case ValidationRuleType.CHECKED:

				break;
			case ValidationRuleType.COLLECTION_OR:
			case ValidationRuleType.COLLECTION_AND:
				const subRules = <Array<IValidationRule>> rule.value;
				const aggregation = rule.type === ValidationRuleType.COLLECTION_OR ? some : every;
				return Promise.all(subRules.map(rule => this._validateRule(rule))).then(
					(results:Array<boolean>) => aggregation(results, result => !!result)
				);
			case ValidationRuleType.FUNCTION:

				break;
			case ValidationRuleType.REGEX:

				break;
			default:
				throw new Error(`Unknown validation rule type "${rule.type}"`);
		}
	}

	private _disposeState():void
	{
		if(this.state)
		{
			this.state.isValidating.dispose();
			this.state.isValidated.dispose();
			this.state.validatedValue.dispose();
			this.state = null;
		}
	}

	private _createState():void
	{
		const isValid:ko.Observable<boolean> = ko.observable(null);

		this.state = new FieldState(
			null,
			this.validate,
			this.getRuleState,
			this.value,
			ko.pureComputed(() => isValid() !== null),
			ko.pureComputed(() => this._validatedValue()),
			ko.pureComputed(() => this._isValidating()),
			isValid
		);
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

