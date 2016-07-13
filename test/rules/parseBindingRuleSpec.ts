import chai = require('chai');
import chaiAsPromised = require('chai-as-promised');
import parseBindingRule from '../../src/lib/rules/parseBindingRule';
import {ValidationRuleType} from "../../src/lib/rules/rule";
const {expect} = chai;
chai.use(chaiAsPromised);

describe('parseBindingRule', () =>
{
	describe('with the argument "true"', () =>
	{
		it('should return a rule with type CHECKED and value "true"', () =>
		{
			const rule = parseBindingRule(true);
			expect(rule.type).to.equal(ValidationRuleType.CHECKED);
			expect(rule.value).to.equal(true);
		});
	});
});
