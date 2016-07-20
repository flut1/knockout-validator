import ValidatorFieldBinding from "../bindings/ValidatorFieldBinding";

/**
 * Name of the binding that can be used as a shorthand to add multiple validation bindings
 */
export const SHORTHAND_BINDING_NAME:string = 'validate';

/**
 * Array of ValidatorFieldBinding instances which is used as an abstraction for all the bindings
 * that are allowed on a validator field
 */
export const bindings:Array<ValidatorFieldBinding> = [
	new ValidatorFieldBinding('validateWith', 'with', 'validator', '$validator'),
	new ValidatorFieldBinding('validateOn', 'on', 'validateOn', '__koValidateOn', false),
	new ValidatorFieldBinding('validationRule', 'rule', 'ruleBindingValue'),
	new ValidatorFieldBinding('validationName', 'name', 'name', null, false, 'name'),
	new ValidatorFieldBinding('validationGroup', 'group', 'group', '__koValidationGroup')
];
