import RuleType from "./RuleType";
import {INamedRuleBindingValue, RuleBindingValue} from "./RuleBindingValue";
import Rule from "./Rule";

const SPECIAL_KEY_OR:string = '$or';

const parseBindingRule = (rule:RuleBindingValue, name:string = null):Rule =>
{
	switch(typeof rule)
	{
		case 'object':
			if(Array.isArray(rule))
			{
				return new Rule(
					name,
					(name === SPECIAL_KEY_OR) ? RuleType.COLLECTION_OR : RuleType.COLLECTION_AND,
					(<Array<RuleBindingValue>> rule).map(
						(subRule:RuleBindingValue, index:number) => parseBindingRule(subRule, index.toString())
					)
				);
			}
			if(rule instanceof RegExp)
			{
				return new Rule(
					name,
					RuleType.REGEX,
					rule
				);
			}
			return new Rule(
				name,
				(name === SPECIAL_KEY_OR) ? RuleType.COLLECTION_OR : RuleType.COLLECTION_AND,
				Object.keys(<INamedRuleBindingValue> rule).map(subRuleName => parseBindingRule(rule[subRuleName], subRuleName))
			);
		case 'string':
			return new Rule(
				name,
				RuleType.REGEX,
				new RegExp(<string> rule)
			);
		case 'boolean':
			return new Rule(
				name,
				RuleType.CHECKED,
				rule
			);
		case 'function':
			return new Rule(
				name,
				RuleType.FUNCTION,
				rule
			);
		default:
			throw new Error(`validation rule "${rule}" has unsupported type "${typeof rule}"`);
	}
};

export default parseBindingRule;
