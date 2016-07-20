import Rule from "./Rule";
import RuleType from "./RuleType";

const rulePlaceholder:Rule = new Rule(
	null,
	RuleType.NONE,
	function() {}
);

export default rulePlaceholder;
