import * as chai from 'chai';
import RuleState from "../../../src/lib/rules/RuleState";
import RuleType from "../../../src/lib/rules/RuleType";
const {expect} = chai;

describe('RuleState', () =>
{
	describe('validate', () =>
	{
		describe('with a rule that takes 30ms to complete', () =>
		{
			const rule = new RuleState('test', RuleType.FUNCTION, () => (
				new Promise<boolean>((resolve) =>
				{
					setTimeout(() => resolve(true), 30);
				})
			));
			const validation = rule.validate('foobar');
			it('should eventually resolve with the result', () =>
			{
				expect(validation).to.eventually.equal(true);
			});
			it('should initially set isValidating to "true"', () =>
			{
				expect(rule.isValidating()).to.equal(true);
			});
			it('should return isValidating to false after 30ms', done =>
			{
				setTimeout(() =>
				{
					expect(rule.isValidating()).to.equal(false);
					done();
				}, 60);
			});
		});
		describe('with COLLECTION_AND and two rules that complete at different times', () =>
		{
			it('should initially set isValidating to "true"', () =>
			{
				const rule = new RuleState('test', RuleType.COLLECTION_AND, [
					new RuleState('subtest1', RuleType.FUNCTION, () => (
						new Promise<boolean>((resolve) =>
						{
							setTimeout(() => resolve(false), 30);
						})
					)),
					new RuleState('subtest2', RuleType.FUNCTION, () => (
						new Promise<boolean>((resolve) =>
						{
							setTimeout(() => resolve(true), 90);
						})
					))
				]);
				rule.validate('foobar');
				expect(rule.isValidating()).to.equal(true);
			});
			it('should eventually resolve with the result', () =>
			{
				const rule = new RuleState('test', RuleType.COLLECTION_AND, [
					new RuleState('subtest1', RuleType.FUNCTION, () => (
						new Promise<boolean>((resolve) =>
						{
							setTimeout(() => resolve(false), 30);
						})
					)),
					new RuleState('subtest2', RuleType.FUNCTION, () => (
						new Promise<boolean>((resolve) =>
						{
							setTimeout(() => resolve(true), 90);
						})
					))
				]);
				const validation = rule.validate('foobar');
				expect(validation).to.eventually.equal(false);
			});
			it('should return isValidating to false after both rules complete', done =>
			{
				const rule = new RuleState('test', RuleType.COLLECTION_AND, [
					new RuleState('subtest1', RuleType.FUNCTION, () => (
						new Promise<boolean>((resolve) =>
						{
							setTimeout(() => resolve(false), 30);
						})
					)),
					new RuleState('subtest2', RuleType.FUNCTION, () => (
						new Promise<boolean>((resolve) =>
						{
							setTimeout(() => resolve(true), 90);
						})
					))
				]);
				rule.validate('foobar');
				setTimeout(() =>
				{
					expect(rule.isValidating()).to.equal(false);
					done();
				}, 120);
			});
		});
		describe('with multiple nested COLLECTION_OR where only one eventually resolves true', () =>
		{
			const rule = new RuleState('test', RuleType.COLLECTION_OR, [
				new RuleState('0', RuleType.COLLECTION_OR, [
					new RuleState('0', RuleType.FUNCTION, () => false),
					new RuleState('1', RuleType.COLLECTION_OR, [
						new RuleState('0', RuleType.COLLECTION_OR, [
							new RuleState('0', RuleType.FUNCTION, () => false),
							new RuleState('1', RuleType.FUNCTION, () => (
								new Promise<boolean>((resolve) =>
								{
									setTimeout(() => resolve(true), 90);
								})
							)),
							new RuleState('2', RuleType.FUNCTION, () => false)
						]),
						new RuleState('2', RuleType.FUNCTION, () => false)
					])
				]),
				new RuleState('1', RuleType.FUNCTION, () => (
					new Promise<boolean>((resolve) =>
					{
						setTimeout(() => resolve(false), 30);
					})
				))
			]);
			it('should resolve with true', () =>
			{
				const validation = rule.validate(false);
				expect(validation).to.eventually.equal(true);
			});
		});
		describe('with multiple nested COLLECTION_OR where all eventually resolve with false', () =>
		{
			const rule = new RuleState('test', RuleType.COLLECTION_OR, [
				new RuleState('0', RuleType.COLLECTION_OR, [
					new RuleState('0', RuleType.FUNCTION, () => false),
					new RuleState('1', RuleType.COLLECTION_OR, [
						new RuleState('0', RuleType.COLLECTION_OR, [
							new RuleState('0', RuleType.FUNCTION, () => false),
							new RuleState('1', RuleType.FUNCTION, () => (
								new Promise<boolean>((resolve) =>
								{
									setTimeout(() => resolve(false), 90);
								})
							)),
							new RuleState('2', RuleType.FUNCTION, () => false)
						]),
						new RuleState('2', RuleType.FUNCTION, () => false)
					])
				]),
				new RuleState('1', RuleType.FUNCTION, () => (
					new Promise<boolean>((resolve) =>
					{
						setTimeout(() => resolve(false), 30);
					})
				))
			]);
			it('should resolve with false', () =>
			{
				const validation = rule.validate(false);
				expect(validation).to.eventually.equal(false);
			});
		});
		describe('with a false CHECKED rule', () =>
		{
			const rule = new RuleState('test', RuleType.CHECKED, false);
			it('should resolve with false for a true value', () =>
			{
				const validation = rule.validate(false);
				expect(validation).to.eventually.equal(true);
			});
			it('should resolve with true for a false value', () =>
			{
				const validation = rule.validate(true);
				expect(validation).to.eventually.equal(false);
			});
		});
		describe('with a REGEX rule', () =>
		{
			const rule = new RuleState('test', RuleType.REGEX, /^[0-9]{3}[a-z]{2}/);
			it('should resolve with true for a matching string value', () =>
			{
				const validation = rule.validate('123abc');
				expect(validation).to.eventually.equal(true);
			});
			it('should resolve with false for a non-matching string value', () =>
			{
				const validation = rule.validate('12abcd');
				expect(validation).to.eventually.equal(false);
			});
			it('should resolve with false for a non-string value', () =>
			{
				const validation = rule.validate({foo : 'bar'});
				expect(validation).to.eventually.equal(false);
			});
		});
	});
});
