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

	it('should return the registered the field when calling getField("test-input")', () =>
	{
		const testInput = <HTMLInputElement> document.querySelector('.test-input');
		expect(viewModel.testValidator.getField('test-input').element).to.equal(testInput);
	});

	it('should return a placeholder field when calling getField("unknown-name")', () =>
	{
		expect(viewModel.testValidator.getField('unknown-name').element).to.equal(null);
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

	it('should set the validator isValid state to false after validate() with invalid value', () =>
	{
		return viewModel.testValidator.validate().then(() =>
		{
			expect(viewModel.testValidator.isValid()).to.equal(false);
		});
	});

	it('should add an invalid class when invalid', () =>
	{
		viewModel.testValidator.classnames.isInvalid = 'invalid';
		const testInput = <HTMLInputElement> document.querySelector('.test-input');
		return viewModel.testValidator.validate().then(() =>
		{
			expect(testInput.className).to.contain('invalid');
		});
	});

	it('should set the field isValid state to true after validate() with valid value', () =>
	{
		viewModel.testValidator.getField('test-input').value('1234abc5678');
		return viewModel.testValidator.validate().then(() =>
		{
			expect(viewModel.testValidator.fields()[0].isValid()).to.equal(true);
		});
	});

	it('should set the validator isValid state to true after validate() with valid value', () =>
	{
		viewModel.testValidator.getField('test-input').value('1234abc5678');
		return viewModel.testValidator.validate().then(() =>
		{
			expect(viewModel.testValidator.isValid()).to.equal(true);
		});
	});

	it('should add a valid class when valid', () =>
	{
		viewModel.testValidator.classnames.isValid = 'valid';
		const testInput = <HTMLInputElement> document.querySelector('.test-input');
		viewModel.testValidator.getField('test-input').value('1234abc5678');
		return viewModel.testValidator.validate().then(() =>
		{
			expect(testInput.className).to.contain('valid');
		});
	});

	it('should not add a valid class when it is not explicitly enabled', () =>
	{
		const testInput = <HTMLInputElement> document.querySelector('.test-input');
		viewModel.testValidator.getField('test-input').value('1234abc5678');
		return viewModel.testValidator.validate().then(() =>
		{
			expect(testInput.className).to.equal('test-input');
		});
	});
});
