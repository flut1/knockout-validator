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

	it('should set the field isValid state to true after setting a valid value', done =>
	{
		// should auto validate because of the 'on' binding
		viewModel.testValidator.getField('test-input').value('12345678');
		// we have to wait for the knockout scheduler before the observables update
		ko.tasks.schedule(() =>
		{
			expect(viewModel.testValidator.fields()[0].isValid()).to.equal(true);
			done();
		});
	});

	it('should set the validator isValid state to true after setting a valid value', done =>
	{
		// should auto validate because of the 'on' binding
		viewModel.testValidator.getField('test-input').value('12345678');
		// we have to wait for the knockout scheduler before the observables update
		ko.tasks.schedule(() =>
		{
			expect(viewModel.testValidator.isValid()).to.equal(true);
			done();
		});
	});

	it('should set the field isValid state to false after setting an invalid value', done =>
	{
		// should auto validate because of the 'on' binding
		viewModel.testValidator.getField('test-input').value('12aa345678');
		// we have to wait for the knockout scheduler before the observables update
		ko.tasks.schedule(() =>
		{
			expect(viewModel.testValidator.fields()[0].isValid()).to.equal(false);
			done();
		});
	});

	it('should set the validator isValid state to false after setting an invalid value', done =>
	{
		// should auto validate because of the 'on' binding
		viewModel.testValidator.getField('test-input').value('12345aa678');
		// we have to wait for the knockout scheduler before the observables update
		ko.tasks.schedule(() =>
		{
			expect(viewModel.testValidator.isValid()).to.equal(false);
			done();
		});
	});
});