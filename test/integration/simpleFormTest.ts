import * as ko from 'knockout';
import KnockoutValidator from "../../src/lib/KnockoutValidator";
import * as chai from 'chai';
const simpleForm = require<string>('raw!./template/simple-form.html');
const {expect} = chai;

describe('simple form integration', () =>
{
	let viewModel, wrapper;
	beforeEach(() =>
	{
		viewModel = {
			testValidator: new KnockoutValidator()
		};
		wrapper = document.createElement('div');
		document.body.appendChild(wrapper);
		wrapper.innerHTML = simpleForm;
		ko.applyBindings(viewModel, wrapper);
	});

	afterEach(() =>
	{
		ko.cleanNode(wrapper);
		wrapper.parentElement.removeChild(wrapper);
		viewModel.testValidator.dispose();
	});

	it('should register the field with the validator', () =>
	{
		expect(viewModel.testValidator.fields()).to.have.lengthOf(1);
	});

	it('should resolve validate() with no value as invalid', () =>
	{
		return expect(viewModel.testValidator.validate()).to.eventually.equal(false);
	});

	it('should set the field\'s rule isValid state to false after validate() with invalid value', () =>
	{
		return viewModel.testValidator.validate().then(() =>
		{
			expect(viewModel.testValidator.fields()[0].getRuleState(0).isValid()).to.equal(false);
		});
	});

	it('should set the field isValid state to false after validate() with invalid value', () =>
	{
		return viewModel.testValidator.validate().then(() =>
		{
			expect(viewModel.testValidator.fields()[0].isValid()).to.equal(false);
		});
	});

	it('should add an invalid class when invalid', done =>
	{
		viewModel.testValidator.classnames.isInvalid = 'invalid';
		(<HTMLInputElement> document.querySelector('.simple-form-submit')).click();
		const testInput = <HTMLInputElement> document.querySelector('.test-input');

		setTimeout(() =>
		{
			expect(testInput.className).to.contain('invalid');
			done();
		}, 100);
	});
});
