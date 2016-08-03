import * as chai from 'chai';
import KnockoutValidator from "../../../src/lib/KnockoutValidator";
import * as ko from 'knockout';
import ValidationGroup from "../../../src/lib/fields/ValidationGroup";
const {expect} = chai;

describe('ValidationGroup', () =>
{
	describe('with a first and last name field', () =>
	{
		const validationGroup = new ValidationGroup(values =>
		{
			const fullName = values['first-name'] + ' ' + values['last-name'];
			return fullName === 'John Doe';
		});
	});
});
