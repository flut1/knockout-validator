import {ValidationRuleType, BindingRule, IValidationRule, INamedBindingRules} from "./rule";

const parseBindingRule = (rule:BindingRule, name:string = null):IValidationRule =>
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
				value : Object.keys(<INamedBindingRules> rule).map(subRuleName => parseBindingRule(rule[subRuleName], subRuleName)),
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

export default parseBindingRule;
