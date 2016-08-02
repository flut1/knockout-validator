import * as chai from 'chai';
import KnockoutValidator from "../../../src/lib/KnockoutValidator";
import Field from "../../../src/lib/fields/Field";
import * as ko from 'knockout';
const {expect} = chai;

describe('Field', () =>
{
	describe('with validateOn prop of "value"', () =>
	{
		const testValidator = new KnockoutValidator();
		const testField = new Field('test', null);
		testField.name = 'testField';
		testField.validator = testValidator;
		testField.validateOn = 'value';
		testField.value = ko.observable('');
		testField.rule = /^[0-9]+$/;

		it('should set the isValid state of the field to true after passing a valid value', done =>
		{
			testField.value('328492');
			ko.tasks.schedule(() =>
			{
				expect(testField.isValid()).to.equal(true);
				done();
			});
		});
	});

});
