import * as chai from 'chai';
import parseBindingRule from '../../src/lib/rules/parseBindingRule';
import RuleType from "../../src/lib/rules/RuleType";
import RuleState from "../../src/lib/rules/RuleState";
const {expect} = chai;

describe('parseBindingRule', () =>
{
	describe('with the argument "true"', () =>
	{
		const rule = parseBindingRule(true);
		it('should return a rule with type CHECKED', () =>
		{
			expect(rule.ruleType).to.equal(RuleType.CHECKED);
		});
		it('should return a rule with value "true"', () =>
		{
			expect(rule.test).to.equal(true);
		});
	});
	describe('with the argument "false"', () =>
	{
		const rule = parseBindingRule(false);
		it('should return a rule with type CHECKED', () =>
		{
			expect(rule.ruleType).to.equal(RuleType.CHECKED);
		});
		it('should return a rule with value "false"', () =>
		{
			expect(rule.test).to.equal(false);
		});
	});
	describe('with a number argument', () =>
	{
		it('should throw an error', () =>
		{
			expect(() => parseBindingRule(<any> 2)).to.throw(Error);
		});
	});
	describe('with a string argument', () =>
	{
		const rule = parseBindingRule('foobar');

		it('should return a rule with type REGEX', () =>
		{
			expect(rule.ruleType).to.equal(RuleType.REGEX);
		});
		it('should return a rule with a value that is an instance of RegExp', () =>
		{
			expect(rule.test).to.be.instanceOf(RegExp);
		});
	});
	describe('with a function argument', () =>
	{
		const rule = parseBindingRule(() => true);

		it('should return a rule with type FUNCTION', () =>
		{
			expect(rule.ruleType).to.equal(RuleType.FUNCTION);
		});
		it('should return a rule with a function value', () =>
		{
			expect(typeof rule.test).to.have.equal('function');
		});
	});
	describe('with a regex argument', () =>
	{
		const rule = parseBindingRule(/foo[bar]/g);

		it('should return a rule with type REGEX', () =>
		{
			expect(rule.ruleType).to.equal(RuleType.REGEX);
		});
		it('should return a rule with a regex value', () =>
		{
			expect(rule.test).to.be.instanceOf(RegExp);
		});
	});
	describe('with an array argument', () =>
	{
		const rule = parseBindingRule([true, 'foobar']);

		it('should return a rule with type COLLECTION_AND', () =>
		{
			expect(rule.ruleType).to.equal(RuleType.COLLECTION_AND);
		});

		it('should return a rule with an array of parsed subrules as value', () =>
		{
			expect(rule.test).to.be.instanceOf(Array);
			expect(rule.test).to.have.lengthOf(2);
			expect(rule.test[0].type).to.equal(RuleType.CHECKED);
			expect(rule.test[1].type).to.equal(RuleType.REGEX);
		})
	});
	describe('with an object argument with keys a, b and c', () =>
	{
		const rule = parseBindingRule({
			a : () => false,
			b : 'foobar',
			c : /abc/g
		});

		it('should return a rule with type COLLECTION_AND', () =>
		{
			expect(rule.ruleType).to.equal(RuleType.COLLECTION_AND);
		});

		it('should return a rule with an array of parsed subrules as value', () =>
		{
			expect(rule.test).to.be.instanceOf(Array);
			expect(rule.test).to.have.lengthOf(3);
		});

		it('should return subrules with the object keys as names', () =>
		{
			expect(rule.test[0].name).not.to.equal(rule.test[1].name);
			expect(rule.test[1].name).not.to.equal(rule.test[2].name);
			expect(rule.test[2].name).not.to.equal(rule.test[0].name);
			expect(rule.test[0].name).to.be.oneOf(['a', 'b', 'c']);
			expect(rule.test[1].name).to.be.oneOf(['a', 'b', 'c']);
			expect(rule.test[2].name).to.be.oneOf(['a', 'b', 'c']);
		});

		it('should return the correct types for parsed subrule "a"', () =>
		{
			const ruleA:RuleState = rule.test.find((subRule:RuleState) => (subRule.name === 'a'));
			expect(ruleA.ruleType).to.equal(RuleType.FUNCTION);
		});

		it('should return the correct types for parsed subrule "b"', () =>
		{
			const ruleB:RuleState = rule.test.find((subRule:RuleState) => (subRule.name === 'b'));
			expect(ruleB.ruleType).to.equal(RuleType.REGEX);
		});

		it('should return the correct types for parsed subrule "c"', () =>
		{
			const ruleC:RuleState = rule.test.find((subRule:RuleState) => (subRule.name === 'c'));
			expect(ruleC.ruleType).to.equal(RuleType.REGEX);
		});
	});
});
