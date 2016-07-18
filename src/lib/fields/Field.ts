import * as ko from 'knockout';
import KnockoutValidator from "../KnockoutValidator";
import {BindingRule, IValidationRule} from "../rules/rule";
import parseBindingRule from "../rules/parseBindingRule";
import Disposable from "seng-disposable";
import elementMapper from "../bindings/elementMapper";
import FieldState from "./FieldState";
import RuleState from "../rules/RuleState";

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
		return null;
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
		this._disposeState();
		elementMapper.removeField(this.id);

		super.dispose();
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
			ko.pureComputed(() => this._isValidating()),
			isValid,
			ko.pureComputed(() => isValid() !== null),
			this.value,
			ko.pureComputed(() => this._validatedValue())
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

