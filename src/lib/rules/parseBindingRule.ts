import RuleType from "./RuleType";
import {INamedRuleBindingValue, RuleBindingValue} from "./RuleBindingValue";
import RuleState from "./RuleState";

const SPECIAL_KEY_OR:string = '$or';

const parseBindingRule = (rule:RuleBindingValue, name:string = null):RuleState =>
{
	switch(typeof rule)
	{
		case 'object':
			if(rule === null)
			{
				return null;
			}
			if(Array.isArray(rule))
			{
				return new RuleState(
					name,
					(name === SPECIAL_KEY_OR) ? RuleType.COLLECTION_OR : RuleType.COLLECTION_AND,
					(<Array<RuleBindingValue>> rule).map(
						(subRule:RuleBindingValue, index:number) => parseBindingRule(subRule, index.toString())
					)
				);
			}
			if(rule instanceof RegExp)
			{
				return new RuleState(
					name,
					RuleType.REGEX,
					rule
				);
			}
			return new RuleState(
				name,
				(name === SPECIAL_KEY_OR) ? RuleType.COLLECTION_OR : RuleType.COLLECTION_AND,
				Object.keys(<INamedRuleBindingValue> rule).map(subRuleName => parseBindingRule(rule[subRuleName], subRuleName))
			);
		case 'string':
			return new RuleState(
				name,
				RuleType.REGEX,
				new RegExp(<string> rule)
			);
		case 'boolean':
			return new RuleState(
				name,
				RuleType.CHECKED,
				rule
			);
		case 'function':
			return new RuleState(
				name,
				RuleType.FUNCTION,
				rule
			);
		case 'undefined':
			return null;
		default:
			throw new Error(`validation rule "${rule}" has unsupported type "${typeof rule}"`);
	}
};

export default parseBindingRule;
