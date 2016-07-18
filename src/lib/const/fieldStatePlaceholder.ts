import * as ko from 'knockout';
import FieldState from "../fields/FieldState";

/**
 * Placeholder field instance that will be returned from the field() method whenever a field is not
 * found. This is to make sure bindings don't break if they try to access the validation state of
 * fields that do not exist yet.
 */
const fieldStatePlaceholder:FieldState = new FieldState(
	null,
	() =>
	{
		console.warn('Called validate() on a non-existing field');
		return Promise.resolve(false);
	},
	(name:string) => fieldStatePlaceholder,
	ko.pureComputed<boolean>(():boolean => false),
	ko.observable<boolean>(null),
	ko.pureComputed<boolean>(():boolean => false),
	ko.observable<any>(null),
	ko.pureComputed<any>(():any => null)
);

export default fieldStatePlaceholder;
