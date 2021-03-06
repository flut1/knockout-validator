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
			//noinspection TypeScriptUnresolvedFunction
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
			//noinspection TypeScriptUnresolvedFunction
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

			//noinspection TypeScriptUnresolvedFunction
			testField.value('0');
			setTimeout(() =>
			{
				//noinspection TypeScriptUnresolvedFunction
				testField.value('1');
			}, 100);

			setTimeout(() =>
			{
				//noinspection TypeScriptUnresolvedFunction
				testField.value('2');
			}, 200);

			setTimeout(() =>
			{
				//noinspection TypeScriptUnresolvedFunction
				testField.value('3');
			}, 250);

			setTimeout(() =>
			{
				//noinspection TypeScriptUnresolvedFunction
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
		it('should set the isValidating() observable to true', done =>
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

			testField.validate();
			ko.tasks.schedule(() =>
			{
				expect(testField.isValidating()).to.equal(true);
				done();
			});
		});
		it('should resolve with true', () =>
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
			return expect(validating).to.eventually.equal(true);
		});
		it('should set isValidating() observable to false after validation resolves', () =>
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
			return validating.then(() =>
			{
				expect(testField.isValidating()).to.equal(false);
			});
		});
	});
});
