/**
 * Type alias for a single validation rule function
 */
export type SingleRuleFunction = (value:any) => MaybePromise<boolean>;

/**
 * Type alias for the type of a single rule in the validationRule binding
 */
export type SingleRuleBindingValue = RegExp|string|boolean|SingleRuleFunction;

/**
 * Type alias for all possible values of the validationRule binding
 */
export type RuleBindingValue = SingleRuleBindingValue|INamedRuleBindingValue|Array<SingleRuleBindingValue|INamedRuleBindingValue>;

/**
 * Interface for the value of named rule syntax of the validationRule binding. This is a key-value object
 * with the keys being the name for the rule and the values being a BindingRule value.
 */
export interface INamedRuleBindingValue
{
	[name:string]:RuleBindingValue;
	$some?:INamedRuleBindingValue|Array<SingleRuleBindingValue|INamedRuleBindingValue>;
}

/**
 * Type alias for a type that can also be a Promise that resolves with that type
 */
export type MaybePromise<T> = Promise<T>|T;
