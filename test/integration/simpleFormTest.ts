import * as ko from 'knockout';
import KnockoutValidator from "../../src/lib/KnockoutValidator";
import * as chai from 'chai';
const simpleForm = require<string>('raw!./template/simple-form.html');
const {expect} = chai;

describe('simple form integration', () =>
{
	const viewModel = {
		testValidator: new KnockoutValidator()
	};
	const wrapper = document.createElement('div');
	document.body.appendChild(wrapper);
	wrapper.innerHTML = simpleForm;
	ko.applyBindings(viewModel, wrapper);

	it('should parse bindings and all that', () =>
	{
		expect(viewModel.testValidator.fields()).to.have.lengthOf(1);
	})
});
