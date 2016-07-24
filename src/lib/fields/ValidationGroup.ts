import IValidatable from "../interface/IValidatable";
import * as ko from 'knockout';
import FieldCollection from "./FieldCollection";
import {RuleBindingValue} from "../rules/RuleBindingValue";
import Field from "./Field";

export default class ValidationGroup extends FieldCollection implements IValidatable {
	public fields:ko.PureComputed<Array<Field>> = ko.pureComputed(() => this._fields());

	protected _value:ko.PureComputed<ValueMap> = ko.pureComputed(() => this._fields().reduce(
		(values:ValueMap, field:Field) => values[field.name] = field.value(), {})
	);
	private _fields:ko.ObservableArray<Field> = ko.observableArray<Field>([]).extend({
		deferred : true
	});

	constructor(rule:RuleBindingValue)
	{
		super();

		if(!this._setRuleFromBindingValue(rule))
		{
			throw new Error('Invalid rule passed to ValidationGroup constructor.');
		}
	}

	public addField(field:Field):void
	{
		this._fields.push(field);
		if(typeof field.value === 'undefined')
		{
			throw new Error('Trying to add field without value to ValidationGroup');
		}
		else if(!ko.isObservable(field))
		{
			throw new Error('Trying to add field with non-observable value to ValidationGroup');
		}
		this._valueSubscriptions.push(field.value.subscribe(this._onValueChange));
	}

	public removeField(field:Field):void
	{
		const fields = this._fields();
		for(let i=fields.length; i>=0; i-- )
		{
			if(fields[i] === field)
			{
				this._fields.splice(i, 1);
				this._valueSubscriptions[i].dispose();
				this._valueSubscriptions.splice(i, 1);
			}
		}

	}

	public get values():ValueMap
	{
		return this._value();
	};
}

export type ValueMap = {[name:string]:any};
