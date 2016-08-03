import * as ko from 'knockout';
import KnockoutValidator from "../../src/lib/KnockoutValidator";
import * as chai from 'chai';
const shorthandForm = require<string>('raw!./template/shorthand-form.html');
const {expect} = chai;

describe('shorthand form integration', () =>
{
	let viewModel, wrapper;
	beforeEach(() =>
	{
		viewModel = {
			testValidator: new KnockoutValidator()
		};
		wrapper = document.createElement('div');
		document.body.appendChild(wrapper);
		wrapper.innerHTML = shorthandForm;
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

	it('should resolve validate() with no value as invalid', () =>
	{
		return expect(viewModel.testValidator.validate()).to.eventually.equal(false);
	});

	it('should auto-validate the field after setting a value', done =>
	{
		// should auto validate because of the 'on' binding
		const testInput = <HTMLInputElement> document.querySelector('.test-input');
		testInput.value = '12345678';
		ko.utils.triggerEvent(testInput, 'change');
		// we have to wait for the knockout scheduler before the observables update
		ko.tasks.schedule(() =>
		{
			expect(viewModel.testValidator.fields()[0].isValid()).not.to.equal(null);
			done();
		});
	});
});
