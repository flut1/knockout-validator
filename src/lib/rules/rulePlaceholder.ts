import RuleState from "./RuleState";
import RuleType from "./RuleType";

const rulePlaceholder:RuleState = new RuleState(
	null,
	RuleType.NONE,
	function() {}
);

export default rulePlaceholder;
