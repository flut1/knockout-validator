import * as chai from 'chai';
import * as ko from 'knockout';
import ValidationGroup from "../../../src/lib/fields/ValidationGroup";
import Field from "../../../src/lib/fields/Field";
const {expect} = chai;

describe('ValidationGroup', () =>
{
	describe('addField()', () =>
	{
		describe('called twice with the same field', () =>
		{
			const validationGroup = new ValidationGroup(values => true);
			const testField = new Field('0', null);
			testField.value = ko.observable();

			it('should throw an error', () =>
			{
				expect(() =>
				{
					validationGroup.addField(testField);
					validationGroup.addField(testField);
				}).to.throw(Error);
			});
		});
		describe('called with a field with no value', () =>
		{
			const validationGroup = new ValidationGroup(values => true);
			const testField = new Field('0', null);

			it('should throw an error', () =>
			{
				expect(() =>
				{
					validationGroup.addField(testField);
				}).to.throw(Error);
			});
		});
	});

	describe('with a first and last name field', () =>
	{
		it('should register the fields with the group', () =>
		{
			const validationGroup = new ValidationGroup(values => true);

			const firstNameField = new Field('0', null);
			firstNameField.name = 'first-name';
			firstNameField.value = ko.observable();
			firstNameField.groups = validationGroup;

			const lastNameField = new Field('1', null);
			lastNameField.name = 'last-name';
			lastNameField.value = ko.observable();
			lastNameField.groups = validationGroup;

			expect(validationGroup.fields()).to.have.lengthOf(2);
			expect(validationGroup.fields()).to.contain(firstNameField);
			expect(validationGroup.fields()).to.contain(lastNameField);
		});

		describe('running validate() with no values set', () =>
		{
			const validationGroup = new ValidationGroup(values =>
			{
				const fullName = values['first-name'] + ' ' + values['last-name'];
				return (fullName === 'John Doe');
			});

			const firstNameField = new Field('0', null);
			firstNameField.name = 'first-name';
			firstNameField.value = ko.observable();
			firstNameField.groups = validationGroup;

			const lastNameField = new Field('1', null);
			lastNameField.name = 'last-name';
			lastNameField.value = ko.observable();
			lastNameField.groups = validationGroup

			it('should resolve with false', () =>
			{
				return expect(validationGroup.validate()).to.eventually.equal(false);
			});
		});

		describe('with values set on the fields', () =>
		{
			const validationGroup = new ValidationGroup(values => true);

			const firstNameField = new Field('0', null);
			firstNameField.name = 'first-name';
			firstNameField.value = ko.observable();
			firstNameField.groups = validationGroup;

			const lastNameField = new Field('1', null);
			lastNameField.name = 'last-name';
			lastNameField.value = ko.observable();
			lastNameField.groups = validationGroup;

			//noinspection TypeScriptUnresolvedFunction
			firstNameField.value('John');
			//noinspection TypeScriptUnresolvedFunction
			lastNameField.value('Doe');
			it('should save the values to the validationGroup values observable', () =>
			{
				const values = validationGroup.values();
				expect(values['first-name']).to.equal('John');
				expect(values['last-name']).to.equal('Doe');
			});
		});

		describe('with validateOn set to "value"', () =>
		{

			it('should auto-validate when one of the fields values change', done =>
			{
				const validationGroup = new ValidationGroup(values => true);
				validationGroup.validateOn = 'value';

				const firstNameField = new Field('0', null);
				firstNameField.name = 'first-name';
				firstNameField.value = ko.observable();
				firstNameField.groups = validationGroup;

				const lastNameField = new Field('1', null);
				lastNameField.name = 'last-name';
				lastNameField.value = ko.observable();
				lastNameField.groups = validationGroup;

				//noinspection TypeScriptUnresolvedFunction
				firstNameField.value('John');

				ko.tasks.schedule(() =>
				{
					expect(validationGroup.isValidated()).to.equal(true);
					done();
				});
			});

			it('should should initially not be validated', () =>
			{
				const validationGroup = new ValidationGroup(values => true);
				validationGroup.validateOn = 'value';

				const firstNameField = new Field('0', null);
				firstNameField.name = 'first-name';
				firstNameField.value = ko.observable();
				firstNameField.groups = validationGroup;

				const lastNameField = new Field('1', null);
				lastNameField.name = 'last-name';
				lastNameField.value = ko.observable();
				lastNameField.groups = validationGroup;

				expect(validationGroup.isValidated()).to.equal(false);
			});
		});

		describe('running validate() with correct values set', () =>
		{
			const validationGroup = new ValidationGroup(values =>
			{
				const fullName = values['first-name'] + ' ' + values['last-name'];
				return (fullName === 'John Doe');
			});

			const firstNameField = new Field('0', null);
			firstNameField.name = 'first-name';
			firstNameField.value = ko.observable();
			firstNameField.groups = validationGroup;

			const lastNameField = new Field('1', null);
			lastNameField.name = 'last-name';
			lastNameField.value = ko.observable();
			lastNameField.groups = validationGroup;

			//noinspection TypeScriptUnresolvedFunction
			firstNameField.value('John');
			//noinspection TypeScriptUnresolvedFunction
			lastNameField.value('Doe');
			it('should resolve with true', () =>
			{
				const validation = validationGroup.validate();
				return expect(validation).to.eventually.equal(true);
			});
		});
	});
});
