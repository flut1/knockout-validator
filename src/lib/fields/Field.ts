import * as ko from 'knockout';
import KnockoutValidator from "../KnockoutValidator";
import elementMapper from "../bindings/elementMapper";
import IValidatableRule from "../interface/IValidatableRule";
import ValidationGroup from "./ValidationGroup";
import every from 'lodash.every';
import FieldCollection from "./FieldCollection";

export default class Field extends FieldCollection implements IValidatableRule
{
	public /*readonly*/ validatedValue:ko.PureComputed<any>;
	public name:string;

	private _groupBinding:Array<ValidationGroup>|ValidationGroup = [];
	private _groups:Array<ValidationGroup> = [];
	private _validator:KnockoutValidator;
	private _validatedValue:ko.Observable<any> = ko.observable(null).extend({deferred : true});

	constructor(public id:string)
	{
		super();

		this.validatedValue = ko.pureComputed(() => this._validatedValue());

	}

	public get value():ko.Observable<any>
	{
		return this._value;
	}

	public set value(value:ko.Observable<any>)
	{
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
		this._clearValueSubscriptions();
		this._value = value;
	}

	public get group():Array<ValidationGroup>|ValidationGroup
	{
		return this._groupBinding;
	}

	public set group(groups:Array<ValidationGroup>|ValidationGroup)
	{
		this._groupBinding = groups;
		this._groups = [].concat(groups);
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

	private _detachFromValidator():void
	{
		if(this._validator)
		{
			this._validator.detachField(this);
			this._validator = null;
		}
	}
}

