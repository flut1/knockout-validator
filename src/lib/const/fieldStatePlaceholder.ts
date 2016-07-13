import * as ko from 'knockout';
import IFieldState from "../fields/IFieldState";

/**
 * Placeholder field instance that will be returned from the field() method whenever a field is not
 * found. This is to make sure bindings don't break if they try to access the validation state of
 * fields that do not exist yet.
 */
const fieldStatePlaceholder:IFieldState = {
	isValid: ko.computed<boolean>(():boolean => null),
	isValidated: ko.computed<boolean>(():boolean => false),
	isValidating: ko.computed<boolean>(():boolean => false),
	value: ko.computed<any>(():any => null),
	validatedValue: ko.computed<any>(():any => null),
	validate: () =>
	{
		console.warn('Called validate() on a non-existing field');
		return false;
	},
	rule: (name:string) => fieldStatePlaceholder,
	name: null
};

export default fieldStatePlaceholder;
