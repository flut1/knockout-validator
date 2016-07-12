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
export type BindingRule = SingleBindingRule|INamedBindingRules|Array<BindingRule>;

/**
 * Interface for the value of named rule syntax of the validationRule binding. This is a key-value object
 * with the keys being the name for the rule and the values being a BindingRule value.
 */
export interface INamedBindingRules
{
	[name:string]:BindingRule;
	$some?:INamedBindingRules|Array<BindingRule>;
}

export const parseBindingRule = (rule:BindingRule, name:string = null):IValidationRule =>
{
	switch(typeof rule)
	{
		case 'object':
			// todo: check for polyfill
			if(Array.isArray(rule))
			{
				return {
					type : ValidationRuleType.COLLECTION_AND,
					value : (<Array<BindingRule>> rule).map(subRule => parseBindingRule(subRule)),
					name
				};
			}
			if(rule instanceof RegExp)
			{
				return {
					type : ValidationRuleType.REGEX,
					value : rule,
					name
				};
			}
			return {
				type : (name === '$or') ? ValidationRuleType.COLLECTION_OR : ValidationRuleType.COLLECTION_AND,
				value : Object.keys(<Object> rule).map(subRuleName => parseBindingRule(rule[subRuleName], subRuleName)),
				name
			};
		case 'string':
			return {
				type : ValidationRuleType.REGEX,
				value : new RegExp(<string> rule),
				name
			};
		case 'boolean':
			return {
				type : ValidationRuleType.CHECKED,
				value : rule,
				name
			};
		case 'function':
			return {
				type : ValidationRuleType.FUNCTION,
				value : rule,
				name
			};
		default:
			throw new Error(`validation rule "${rule}" has unsupported type "${typeof rule}"`);
	}
};
