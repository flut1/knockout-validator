import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import parseBindingRule from '../../src/lib/rules/parseBindingRule';
import {ValidationRuleType, IValidationRule} from "../../src/lib/rules/rule";
const {expect} = chai;
chai.use(chaiAsPromised);

describe('parseBindingRule', () =>
{
	describe('with the argument "true"', () =>
	{
		const rule = parseBindingRule(true);
		it('should return a rule with type CHECKED', () =>
		{
			expect(rule.type).to.equal(ValidationRuleType.CHECKED);
		});
		it('should return a rule with value "true"', () =>
		{
			expect(rule.value).to.equal(true);
		});
	});
	describe('with the argument "false"', () =>
	{
		const rule = parseBindingRule(false);
		it('should return a rule with type CHECKED', () =>
		{
			expect(rule.type).to.equal(ValidationRuleType.CHECKED);
		});
		it('should return a rule with value "false"', () =>
		{
			expect(rule.value).to.equal(false);
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
			expect(rule.type).to.equal(ValidationRuleType.REGEX);
		});
		it('should return a rule with a value that is an instance of RegExp', () =>
		{
			expect(rule.value).to.be.instanceOf(RegExp);
		});
	});
	describe('with a function argument', () =>
	{
		const rule = parseBindingRule(() => true);

		it('should return a rule with type FUNCTION', () =>
		{
			expect(rule.type).to.equal(ValidationRuleType.FUNCTION);
		});
		it('should return a rule with a function value', () =>
		{
			expect(typeof rule.value).to.have.equal('function');
		});
	});
	describe('with a regex argument', () =>
	{
		const rule = parseBindingRule(/foo[bar]/g);

		it('should return a rule with type REGEX', () =>
		{
			expect(rule.type).to.equal(ValidationRuleType.REGEX);
		});
		it('should return a rule with a regex value', () =>
		{
			expect(rule.value).to.be.instanceOf(RegExp);
		});
	});
	describe('with an array argument', () =>
	{
		const rule = parseBindingRule([true, 'foobar']);

		it('should return a rule with type COLLECTION_AND', () =>
		{
			expect(rule.type).to.equal(ValidationRuleType.COLLECTION_AND);
		});

		it('should return a rule with an array of parsed subrules as value', () =>
		{
			expect(rule.value).to.be.instanceOf(Array);
			expect(rule.value).to.have.lengthOf(2);
			expect(rule.value[0].type).to.equal(ValidationRuleType.CHECKED);
			expect(rule.value[1].type).to.equal(ValidationRuleType.REGEX);
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
			expect(rule.type).to.equal(ValidationRuleType.COLLECTION_AND);
		});

		it('should return a rule with an array of parsed subrules as value', () =>
		{
			expect(rule.value).to.be.instanceOf(Array);
			expect(rule.value).to.have.lengthOf(3);
		});

		it('should return subrules with the object keys as names', () =>
		{
			expect(rule.value[0].name).not.to.equal(rule.value[1].name);
			expect(rule.value[1].name).not.to.equal(rule.value[2].name);
			expect(rule.value[2].name).not.to.equal(rule.value[0].name);
			expect(rule.value[0].name).to.be.oneOf(['a', 'b', 'c']);
			expect(rule.value[1].name).to.be.oneOf(['a', 'b', 'c']);
			expect(rule.value[2].name).to.be.oneOf(['a', 'b', 'c']);
		});

		it('should return the correct types for parsed subrule "a"', () =>
		{
			const ruleA:IValidationRule = rule.value.find((subRule:IValidationRule) => (subRule.name === 'a'));
			expect(ruleA.type).to.equal(ValidationRuleType.FUNCTION);
		});

		it('should return the correct types for parsed subrule "b"', () =>
		{
			const ruleB:IValidationRule = rule.value.find((subRule:IValidationRule) => (subRule.name === 'b'));
			expect(ruleB.type).to.equal(ValidationRuleType.REGEX);
		});

		it('should return the correct types for parsed subrule "c"', () =>
		{
			const ruleC:IValidationRule = rule.value.find((subRule:IValidationRule) => (subRule.name === 'c'));
			expect(ruleC.type).to.equal(ValidationRuleType.REGEX);
		});
	});
});
