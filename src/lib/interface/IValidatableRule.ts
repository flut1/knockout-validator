import IValidatable from "./IValidatable";
import RuleType from "../rules/RuleType";

interface IValidatableRule extends IValidatable {
	name:string;
	ruleType:RuleType;
	rule(name?:string|number):IValidatableRule;
}

export default IValidatableRule;
