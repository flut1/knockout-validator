export default class KnockoutValidatorClassnames
{
	/**
	 * Classname that will be added to HTML elements that have been validated as valid. If null,
	 * no class will be added.
	 */
	public isValid:string = null;

	/**
	 * Classname that will be added to HTML elements that have been validated as invalid. If null,
	 * no class will be added.
	 */
	public isInvalid:string = 'invalid';

	/**
	 * Classname that will be added to HTML elements when async validation is performed. The classname
	 * will be removed when validation has completed. If null, no class will be added.
	 */
	public isValidating:string = 'validating';
}
