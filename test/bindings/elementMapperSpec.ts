import * as chai from 'chai';
import {ElementMapper, ID_DOM_ATTRIBUTE} from "../../src/lib/bindings/elementMapper";
import Field from "../../src/lib/fields/Field";
const Set = require('es6-set');
const {expect} = chai;

describe('ElementMapper', () =>
{
	describe('setElementId', () =>
	{
		const elementMapper = new ElementMapper();
		const testElement1 = document.createElement('div');
		const testElement1Id = elementMapper.setElementId(testElement1);
		const testElement2 = document.createElement('div');
		const testElement2Id = elementMapper.setElementId(testElement2);
		const testElement3 = document.createElement('div');
		const testElement3Id = elementMapper.setElementId(testElement3);
		const testElement4 = document.createElement('div');
		const testElement4Id = elementMapper.setElementId(testElement4);

		it('should return a unique id on each call', () =>
		{
			const idSet = new Set([testElement1Id, testElement2Id, testElement3Id, testElement4Id]);
			expect(idSet.size).to.equal(4);
		});
	});

	describe('getElementId', () =>
	{
		const elementMapper = new ElementMapper();
		const testElement1 = document.createElement('div');
		elementMapper.setElementId(testElement1);
		const testElement2 = document.createElement('div');
		elementMapper.setElementId(testElement2);
		const testElement3 = document.createElement('div');
		const testElement3Id = elementMapper.setElementId(testElement3);
		const testElement4 = document.createElement('div');
		elementMapper.setElementId(testElement4);

		it('should return the id set by setElementId', () =>
		{
			expect(elementMapper.getElementId(testElement3)).to.equal(testElement3Id);
		});
	});

	describe('createField', () =>
	{
		const elementMapper = new ElementMapper();

		const field = elementMapper.createField('test');
		it('should return a Field instance', () =>
		{
			expect(field).to.be.instanceOf(Field);
		});
	});

	describe('getField', () =>
	{
		describe('with an id that has been passed to createField', () =>
		{
			const elementMapper = new ElementMapper();

			const field = elementMapper.createField('test');
			const field2 = elementMapper.getField('test');
			it('should return the same field that is returned by createField', () =>
			{
				expect(field).to.equal(field2);
			});
		});
		describe('with an id that has not been passed to createField', () =>
		{
			const elementMapper = new ElementMapper();

			elementMapper.createField('test');
			const field = elementMapper.getField('foo');
			it('should return null', () =>
			{
				expect(field).to.be.null;
			});
		});
	});
});
