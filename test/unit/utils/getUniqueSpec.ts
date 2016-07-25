import * as chai from 'chai';
import getUnique from "../../../src/lib/utils/getUnique";
const {expect} = chai;

describe('getUnique', () =>
{
	describe('with two empty arrays', () =>
	{
		it('should callback with two empty arrays', () =>
		{
			getUnique([], [], (a, b) =>
			{
				expect(a).to.be.instanceOf(Array);
				expect(a).to.have.lengthOf(0);
				expect(b).to.be.instanceOf(Array);
				expect(b).to.have.lengthOf(0);
			});
		});
	});
	describe('with two disjoint arrays', () =>
	{
		it('should callback with arrays with the same content', () =>
		{
			getUnique([0, 1, 'a'], [2, 3, 'b'], (a, b) =>
			{
				expect(a).to.have.lengthOf(3);
				expect(b).to.have.lengthOf(3);
				expect(a[0]).to.equal(0);
				expect(a[1]).to.equal(1);
				expect(a[2]).to.equal('a');
				expect(b[0]).to.equal(2);
				expect(b[1]).to.equal(3);
				expect(b[2]).to.equal('b');
			});
		});
	});
	describe('with two arrays with the same content in different order', () =>
	{
		it('should callback with two empty arrays', () =>
		{
			const foobar = {some: 'object'};
			getUnique([1, 2, 3, 4, 5, 'a', 'b', foobar, false], [false, 'a', 4, 3, 2, 'b', 5, foobar, 1], (a, b) =>
			{
				expect(a).to.be.instanceOf(Array);
				expect(a).to.have.lengthOf(0);
				expect(b).to.be.instanceOf(Array);
				expect(b).to.have.lengthOf(0);
			});
		});
	});
	describe('with arrays with both common and unique elements', () =>
	{

		const foobar = {some: 'object'};
		getUnique([2, 3, 4, 5, 'a', 'b', false], ['a', 4, 2, 'b', 5, foobar, 1], (a, b) =>
		{
			it('should callback with the unique elements of the first array', () =>
			{
				expect(a).to.have.lengthOf(2);
				expect(a[0]).to.equal(3);
				expect(a[1]).to.equal(false);
			});
			it('should callback with the unique elements of the second array', () =>
			{
				expect(b).to.have.lengthOf(2);
				expect(b[0]).to.equal(foobar);
				expect(b[1]).to.equal(1);
			});
		});
	});
});
