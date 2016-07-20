import Disposable from 'seng-disposable';
import * as ko from 'knockout';
import ClassnameOptions  from './options/Classnames';
import Field from "./fields/Field";
import FieldState from "./fields/FieldState";
import createBindings from "./bindings/createBindings";
import some from 'lodash.some';
import IValidatable from "./interface/IValidatable";

createBindings(ko.bindingHandlers);

export default class KnockoutValidator extends Disposable implements IValidatable
{
	/**
	 * Object containing the classnames that the validator will apply on HTML elements based on validation state.
	 * These may be changed if different classnames are desired.
	 */
	public classnames = new ClassnameOptions();

	/**
	 * Timeout for async validation in ms. If validation takes longer than this value, it will throw a
	 * warning and return false (or invalid). If 0, validation will never timeout.
	 */
	public asyncValidationTimeout:number = 5000;

	/**
	 * Knockout computed value that returns _true_ while validation of one or more field is in progress. Is
	 * returned to false after validation has completed
	 */
	public isValidating:ko.PureComputed<boolean>;

	/**
	 * Knockout computed that returns _true_ when all groups and fields have been validated
	 * and are valid. If one of the groups or fields are invalid, this returns _false_.
	 *
	 * **If not all groups or fields have been validated, returns _null_**
	 */
	public isValid:ko.PureComputed<boolean>;

	/**
	 * Knockout computed that returns _true_ when all fields have been validated. Otherwise,
	 * returns _false_.
	 */
	public isValidated:ko.PureComputed<boolean>;

	/**
	 * Returns an array of FieldState instances representing the state of each field in the
	 * validator.
	 */
	public fields:ko.PureComputed<Array<FieldState>> = ko.pureComputed(() =>
	{
		return this._fields().map((field:Field) => field.state);
	});

	/**
	 * Observable array of fields attached to this validator. The accessors of this fields are
	 * exposed through the public [[fields]] property.
	 */
	private _fields:ko.ObservableArray<Field> = ko.observableArray([]);

	constructor()
	{
		super();

		this._initComputed();
	}

	public validate():Promise<boolean>
	{
		const fields = this._fields();
		fields.forEach(field => field.state.isValid(null));

		return Promise.all(fields.map(field => field.validate())).then((results:Array<boolean>) =>
		{
			let isValid = true;
			for(let i = 0; isValid && i < results.length; i++)
			{
				if(!results[i])
				{
					isValid = false;
				}
			}
			return new Promise((resolve:(result:boolean) => void) =>
			{
				ko.tasks.schedule(() => resolve(isValid));
			});
		});
	}

	/**
	 * Unregisters a field with this validator instance
	 * @param field The field to remove
	 */
	public detachField(field:Field):void
	{
		const index = this._fields().indexOf(field);
		if(index >= 0)
		{
			this._fields.splice(index, 1);
		}
	}

	public clearValidation():void
	{

	}

	/**
	 * Registers a field with this validator instance
	 * @param field The field to add
	 */
	public attachField(field:Field):void
	{
		if(this._fields().indexOf(field) < 0)
		{
			this._fields.push(field);
		}
	}

	/**
	 * Returns a map of the values of all fields attached to this validator by name.
	 * @param validatedOnly If true, will only include the validated fields in the returned
	 * map.
	 */
	public getValues(validatedOnly:boolean = false):{[name:string]:any}
	{
		let fields = this._fields();
		if(validatedOnly)
		{
			fields = fields.filter(field => field.state.isValidated());
		}
		return fields.reduce((values:{[name:string]:any}, field:Field) =>
		{
			values[field.name] = field.state.value();
			return values;
		}, {});
	}

	/**
	 * Clears the computed values and subscriptions of this validator for garbage collection.
	 * This method should always be called when the validator is no longer used to prevent
	 * memory leaks.
	 */
	public dispose():void
	{
		if(this.isValid)
		{
			this.isValid.dispose();
			this.isValid = null;
		}
		if(this.isValidated)
		{
			this.isValidated.dispose();
			this.isValidated = null;
		}
		if(this.isValidating)
		{
			this.isValidating.dispose();
			this.isValidating = null;
		}
		super.dispose();
	}

	private _initComputed():void
	{
		this.isValid = ko.pureComputed(() =>
		{
			const fields = this._fields();
			let isValid = true;
			for(let i = 0; i < fields.length; i++)
			{
				const fieldIsValid = fields[i].state.isValid();
				if(fieldIsValid === null)
				{
					return null;
				}
				else if(!fieldIsValid)
				{
					isValid = false;
				}
			}
			return isValid;
		}).extend({deferred: true});

		this.isValidated = ko.pureComputed(() => !some(this._fields(), field => !field.isValidated())).extend({deferred: true});
		this.isValidating = ko.pureComputed(() => some(this._fields(), field => field.isValidating())).extend({deferred: true});
	}
}
