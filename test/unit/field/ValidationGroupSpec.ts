import * as chai from 'chai';
import * as ko from 'knockout';
import ValidationGroup from "../../../src/lib/fields/ValidationGroup";
import Field from "../../../src/lib/fields/Field";
const {expect} = chai;

describe('ValidationGroup', () =>
{
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
