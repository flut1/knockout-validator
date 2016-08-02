import * as chai from 'chai';
import KnockoutValidator from "../../../src/lib/KnockoutValidator";
import Field from "../../../src/lib/fields/Field";
import * as ko from 'knockout';
const {expect} = chai;

describe('Field', () =>
{
	describe('with validateOn prop of "value"', () =>
	{
		describe('after setting a valid value', () =>
		{
			const testValidator = new KnockoutValidator();
			const testField = new Field('test', null);
			testField.name = 'testField';
			testField.validator = testValidator;
			testField.validateOn = 'value';
			testField.value = ko.observable('');
			testField.rule = /^[0-9]+$/;
			testField.value('328492');

			it('should set the isValid state of the field to true', done =>
			{
				ko.tasks.schedule(() =>
				{
					expect(testField.isValid()).to.equal(true);
					done();
				});
			});
		});
		describe('after setting an invalid value', () =>
		{
			const testValidator = new KnockoutValidator();
			const testField = new Field('test', null);
			testField.name = 'testField';
			testField.validator = testValidator;
			testField.validateOn = 'value';
			testField.value = ko.observable('');
			testField.rule = /^[0-9]+$/;
			testField.value('3284a92');

			it('should set the isValid state of the field to false', done =>
			{
				ko.tasks.schedule(() =>
				{
					expect(testField.isValid()).to.equal(false);
					done();
				});
			});
		});
	});
	describe('with validateOn prop of "value(200)"', () =>
	{
		describe('when calling value multiple times within 200ms', () =>
		{
			const testValidator = new KnockoutValidator();
			const testField = new Field('test', null);
			testField.name = 'testField';
			testField.validator = testValidator;
			testField.validateOn = 'value(200)';
			testField.value = ko.observable('');
			let ruleCallCount = 0;
			testField.rule = () =>
			{
				ruleCallCount++;
				return true;
			};

			testField.value('0');
			setTimeout(() =>
			{
				testField.value('1');
			}, 100);

			setTimeout(() =>
			{
				testField.value('2');
			}, 200);

			setTimeout(() =>
			{
				testField.value('3');
			}, 250);

			setTimeout(() =>
			{
				testField.value('4');
			}, 400);

			it('should only call the validation method once', done =>
			{
				setTimeout(() =>
				{
					ko.tasks.schedule(() =>
					{
						expect(ruleCallCount).to.equal(1);
						done();
					});
				}, 700);
			});
		});
	});
	describe('validating with an asynchronous rule that resolves with true', () =>
	{
		const testField = new Field('test', null);
		testField.name = 'testField';
		testField.validateOn = 'value';
		testField.value = ko.observable('');
		testField.rule = () => new Promise<boolean>(resolve =>
		{
			setTimeout(() =>
			{
				resolve(true);
			}, 600);
		});

		const validating = testField.validate();
		let isValidating;
		const scheduleKnockout = new Promise<void>(resolve =>
		{
			ko.tasks.schedule(() =>
			{
				isValidating = testField.isValidating();
				resolve();
			});
		});
		it('should set the isValidating() observable to true', () =>
		{
			return scheduleKnockout.then(() =>
			{
				expect(isValidating).to.equal(true);
			});
		});
		it('should resolve with true', () =>
		{
			return expect(validating).to.eventually.equal(true);
		});
		it('should set isValidating() observable to false after validation resolves', () =>
		{
			return validating.then(() =>
			{
				expect(testField.isValidating()).to.equal(false);
			});
		});
	});
});
