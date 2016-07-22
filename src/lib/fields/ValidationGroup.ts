import IValidatable from "../interface/IValidatable";
import * as ko from 'knockout';
import FieldCollection from "./FieldCollection";
import {RuleBindingValue} from "../rules/RuleBindingValue";

export default class ValidationGroup extends FieldCollection implements IValidatable {


	constructor(rule:RuleBindingValue)
	{
		if(!this._setRuleFromBindingValue(rule))
		{
			throw new Error('Invalid rule passed to ValidationGroup constructor.');
		}
	}
}
