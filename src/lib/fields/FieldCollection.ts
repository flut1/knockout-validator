import Disposable from "seng-disposable";
import * as ko from 'knockout';
import RuleState from "../rules/RuleState";
import {RuleBindingValue} from "../rules/RuleBindingValue";
import parseBindingRule from "../rules/parseBindingRule";
import RuleType from "../rules/RuleType";
import {rulePlaceholder} from "../rules/RuleState";

abstract class FieldCollection extends Disposable {
	public /*readonly*/ isValidated:ko.PureComputed<boolean>;
	public /*readonly*/ isValidating:ko.PureComputed<boolean>;
	public /*readonly*/ isValid:ko.PureComputed<boolean>;
	protected _rule:ko.Observable<RuleState> = ko.observable(null);
	protected _currentValidation:Promise<boolean> = null;
	protected _value:ko.Observable<any>|ko.PureComputed<any>;
	protected _validateOn:string;
	protected _autoValidate:boolean = false;
	protected _rateLimitAutoValidate:number = 0;
	protected _pendingAutoValidateId:number = null;
	protected _valueSubscriptions:Array<ko.subscription<any>> = [];
	protected _ruleBindingValue:RuleBindingValue;

	constructor()
	{
		super();

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

	public getRuleState(name?:string|number):RuleState
	{
		return this._rule() || rulePlaceholder;
	}

	public get rule():RuleBindingValue
	{
		return this._ruleBindingValue;
	}

	public set rule(ruleBindingValue:RuleBindingValue)
	{
		if(this._ruleBindingValue !== ruleBindingValue)
		{
			this._ruleBindingValue = ruleBindingValue;
			this._disposeRule();
			this._currentValidation = null;
			this._setRuleFromBindingValue(ruleBindingValue);
		}
	}

	public get validateOn():string
	{
		return this._validateOn;
	}

	public set validateOn(validateOn:string)
	{
		if(this._validateOn !== validateOn)
		{
			this._autoValidate = false;
			this._rateLimitAutoValidate = 0;

			if(this.validateOn === 'value')
			{
				this._autoValidate = true;
			}
			else
			{
				let rateLimitTest = /value\s?\(\s?([0-9]+)\s?\)/;
				let result = rateLimitTest.exec(this.validateOn);

				if(result !== null)
				{
					this._autoValidate = true;
					this._rateLimitAutoValidate = parseInt(result[1], 10);
				}
			}

			this._validateOn = validateOn;
		}
	}

	public get ruleType():RuleType
	{
		const rule = this._rule();
		return rule ? rule.ruleType : RuleType.NONE;
	}

	public clearValidation()
	{
		this.isValid(false);
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
			this._currentValidation = rule.validate(typeof value === 'undefined' ? this._value() : value).then(result =>
			{
				this._currentValidation = null;

				return result;
			});
		}

		return this._currentValidation;
	};

	public dispose():void
	{
		this._clearValueSubscriptions();
		this.isValid.dispose();
		this.isValidated.dispose();
		this.isValidating.dispose();
		this._disposeRule();

		super.dispose();
	}

	protected _onValueChange()
	{
		if(this._autoValidate)
		{
			if(this._rateLimitAutoValidate > 0)
			{
				if(this._currentValidation === null)
				{
					if(this._pendingAutoValidateId !== null)
					{
						clearTimeout(this._pendingAutoValidateId);
					}
					this._pendingAutoValidateId = setTimeout(() =>
					{
						this._pendingAutoValidateId = null;
						this.validate();
					}, this._rateLimitAutoValidate);
				}
				else
				{
					this.validate();
				}
			}
		}
	}

	protected _clearValueSubscriptions():void
	{
		this._valueSubscriptions.forEach(subscription => subscription.dispose());
		this._valueSubscriptions.length = 0;
	}

	protected _setRuleFromBindingValue(ruleBindingValue:RuleBindingValue):RuleState
	{
		const rule = parseBindingRule(ruleBindingValue);
		this._rule(rule);
		return rule;
	}

	protected _disposeRule():void
	{
		const currentRule = this._rule();
		if(currentRule)
		{
			currentRule.dispose();
		}
	}
}

export default FieldCollection;
