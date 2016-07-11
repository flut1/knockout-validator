import Disposable from 'seng-disposable';
import ko from 'knockout';
import ClassnameOptions  from './options/Classnames';

export default class KnockoutValidator extends Disposable {
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


	public dispose():void
	{
		super.dispose();
	}
}
