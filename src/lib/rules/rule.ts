import {MaybePromise} from "../util/promiseUtils";

export enum ValidationRuleType {
	COLLECTION_AND,
	COLLECTION_OR,
	REGEX,
	CHECKED,
	FUNCTION
}

export interface IValidationRule {
	type:ValidationRuleType;
	value:any;
	name:string;
}

export type SingleRuleFunction = (value:any) => MaybePromise<boolean>;

/**
 * Type alias for the type of a single rule in the validationRule binding
 */
export type SingleBindingRule = RegExp|string|boolean|SingleRuleFunction;

/**
 * Type alias for all possible values of the validationRule binding
 */
export type BindingRule = SingleBindingRule|INamedBindingRules|Array<SingleBindingRule|INamedBindingRules>;

/**
 * Interface for the value of named rule syntax of the validationRule binding. This is a key-value object
 * with the keys being the name for the rule and the values being a BindingRule value.
 */
export interface INamedBindingRules
{
	[name:string]:BindingRule;
	$some?:INamedBindingRules|Array<SingleBindingRule|INamedBindingRules>;
}
