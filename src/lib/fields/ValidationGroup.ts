import IValidatable from "../interface/IValidatable";
import * as ko from 'knockout';
import FieldCollection from "./FieldCollection";
import {RuleBindingValue} from "../rules/RuleBindingValue";
import Field from "./Field";

export default class ValidationGroup extends FieldCollection implements IValidatable
{
	public fields: ko.PureComputed<Array<Field>> = ko.pureComputed(() => this._fields());

	protected _value: ko.PureComputed<ValueMap> = ko.pureComputed(() => this._fields().reduce(
		(values: ValueMap, field: Field) =>
		{
			values[field.name] = field.value();
			return values;
		}, {}
	));
	private _fields: ko.ObservableArray<Field> = ko.observableArray<Field>([]);

	constructor(rule: RuleBindingValue)
	{
		super();

		if(!this._setRuleFromBindingValue(rule))
		{
			throw new Error('Invalid rule passed to ValidationGroup constructor.');
		}
	}

	public addField(field: Field): void
	{
		if(this._fields().indexOf(field) !== -1)
		{
			throw new Error('Trying to add the same Field to a ValidationGroup twice');
		}
		this._fields.push(field);
		if(typeof field.value === 'undefined')
		{
			throw new Error('Trying to add field without value to ValidationGroup');
		}

		this._valueSubscriptions.push(field.value.subscribe(this._onValueChange));
	}

	public removeField(field: Field): void
	{
		const fields = this._fields();
		for(let i = fields.length; i >= 0; i--)
		{
			if(fields[i] === field)
			{
				this._fields.splice(i, 1);
				this._valueSubscriptions[i].dispose();
				this._valueSubscriptions.splice(i, 1);
			}
		}

	}

	public get values(): ko.PureComputed<ValueMap>
	{
		return this._value;
	};
}

export type ValueMap = {[name: string]: any};
