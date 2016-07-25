import * as chai from 'chai';
import {getValueBindingKey} from "../../../src/lib/bindings/genericBindingHandler";
const {expect} = chai;

describe('getValueBindingKey', () =>
{
	describe('with a checkbox', () =>
	{
		const checkbox = document.createElement('input');
		checkbox.setAttribute('type', 'checkbox');
		const valueBindingKey = getValueBindingKey(checkbox);
		it('should return "checked"', () =>
		{
			expect(valueBindingKey).to.equal('checked');
		})
	});
	describe('with a textarea', () =>
	{
		const textarea = document.createElement('textarea');
		const valueBindingKey = getValueBindingKey(textarea);
		it('should return "value"', () =>
		{
			expect(valueBindingKey).to.equal('value');
		})
	});
	describe('with a text input', () =>
	{
		const input = document.createElement('input');
		input.setAttribute('type', 'text');
		const valueBindingKey = getValueBindingKey(input);
		it('should return "value"', () =>
		{
			expect(valueBindingKey).to.equal('value');
		})
	});
	describe('with a number input', () =>
	{
		const input = document.createElement('input');
		input.setAttribute('type', 'number');
		const valueBindingKey = getValueBindingKey(input);
		it('should return "value"', () =>
		{
			expect(valueBindingKey).to.equal('value');
		})
	});
	describe('with a tel input', () =>
	{
		const input = document.createElement('input');
		input.setAttribute('type', 'tel');
		const valueBindingKey = getValueBindingKey(input);
		it('should return "value"', () =>
		{
			expect(valueBindingKey).to.equal('value');
		})
	});
	describe('with an email input', () =>
	{
		const input = document.createElement('input');
		input.setAttribute('type', 'email');
		const valueBindingKey = getValueBindingKey(input);
		it('should return "value"', () =>
		{
			expect(valueBindingKey).to.equal('value');
		})
	});
	describe('with a radio button', () =>
	{
		const input = document.createElement('input');
		input.setAttribute('type', 'radio');
		it('should throw an error', () =>
		{
			expect(() => getValueBindingKey(input)).to.throw(Error);
		})
	});
	describe('with a selectbox without multiple attribute', () =>
	{
		const select = document.createElement('select');
		const valueBindingKey = getValueBindingKey(select);
		it('should return "value"', () =>
		{
			expect(valueBindingKey).to.equal('value');
		})
	});
	describe('with a selectbox with multiple attribute', () =>
	{
		const select = document.createElement('select');
		select.setAttribute('multiple', 'true');
		const valueBindingKey = getValueBindingKey(select);
		it('should return "selectedOptions"', () =>
		{
			expect(valueBindingKey).to.equal('selectedOptions');
		});
	});
	describe('with a div element', () =>
	{
		const div = document.createElement('div');
		it('should throw an error', () =>
		{
			expect(() => getValueBindingKey(div)).to.throw(Error);
		})
	});
});
