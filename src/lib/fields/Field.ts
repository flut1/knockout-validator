import * as ko from 'knockout';
import KnockoutValidator from "../KnockoutValidator";
import elementMapper from "../bindings/elementMapper";
import IValidatableRule from "../interface/IValidatableRule";
import ValidationGroup from "./ValidationGroup";
import * as every from 'lodash/every';
import FieldCollection from "./FieldCollection";
import getUnique from "../utils/getUnique";
import disposeSubscriptionArray from "../utils/disposeSubscriptionArray";

export default class Field extends FieldCollection implements IValidatableRule
{
	public /*readonly*/ validatedValue:ko.PureComputed<any>;
	public name:string;

	protected _value:ko.Observable<any>;
	private _groupBinding:Array<ValidationGroup>|ValidationGroup = [];
	private _groups:Array<ValidationGroup> = [];
	private _validator:KnockoutValidator;
	private _validatedValue:ko.Observable<any> = ko.observable(null);

	constructor(public id:string, private _element:HTMLElement)
	{
		super();

		this.validatedValue = ko.pureComputed(() => this._validatedValue());
		this._isValidSubscriptions.push(this.isValid.subscribe(this._isValidChangeHandler));
	}

	public get element():HTMLElement
	{
		return this._element;
	}

	public get value():ko.Observable<any>
	{
		return this._value;
	}

	public set value(value:ko.Observable<any>)
	{
		disposeSubscriptionArray(this._valueSubscriptions);
		if(!ko.isObservable(value))
		{
			throw new Error(`Non-observable value "${value}" passed to knockout-validator Field instance.`);
		}
		else if(!ko.isWritableObservable(value))
		{
			console.warn(`The observable passed to the "${this.name}" knockout-validator field is not writable. This is not recommended.`);
		}
		else
		{
			this._valueSubscriptions.push(value.subscribe(this._onValueChange));
		}
		this._value = value;
	}

	public get groups():Array<ValidationGroup>|ValidationGroup
	{
		return this._groupBinding;
	}

	public set groups(groups:Array<ValidationGroup>|ValidationGroup)
	{
		this._groupBinding = groups;
		const groupsArray = [].concat(groups);
		getUnique(this._groups, groupsArray, (remove:Array<ValidationGroup>, add:Array<ValidationGroup>) =>
		{
			remove.forEach(group => group.removeField(this));
			add.forEach(group => group.addField(this));
		});
		this._groups = groupsArray;
	}

	public clearValidation():void
	{
		super.clearValidation();
		this._validatedValue(null);
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

		this.validatedValue.dispose();
		super.dispose();
	}

	public validateGroups():Promise<boolean>
	{
		if(!this._groups.length)
		{
			return Promise.resolve(true);
		}

		return Promise.all(this._groups.map(group => group.validate())).then((results:Array<boolean>) =>
			every(results, result => !!result)
		);
	}

	private _isValidChangeHandler = (isValid:boolean):void =>
	{
		if(isValid !== null)
		{
			this._validatedValue(this._value());
		}

		this._applyValidationClasses();
	};

	private _applyValidationClasses():void
	{
		if(this._validator && this._element)
		{
			const isValid = this.isValid();
			if(isValid !== null)
			{
				const {classnames} = this._validator;

				if(classnames.isInvalid)
				{
					this._element.classList[isValid ? 'remove' : 'add'](classnames.isInvalid);
				}
				if(classnames.isValid)
				{
					this._element.classList[isValid ? 'add' : 'remove'](classnames.isValid);
				}
			}
		}
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

