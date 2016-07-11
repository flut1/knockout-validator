import Field from "../fields/Field";

/**
 * The DOM attribute key used to save an id of a Field
 */
const ID_DOM_ATTRIBUTE = 'data-ko-validator-id';

/**
 * Counter to assign unique ids to each validator
 */
let idCounter:number = 1;

/**
 * Static map of each field by id. Is used to lookup fields based on the id saved
 * on the corresponding HTML element.
 */
const fields:{[id:string] : Field} = {};

/**
 * Generates a new id for an HTML element and sets it as an attribute on the element
 * @param element The element to generate an id for
 * @returns The generated id
 */
export const setElementId = (element:HTMLElement):string =>
{
	const id = (idCounter++).toString();
	element.setAttribute(ID_DOM_ATTRIBUTE, id);
	return id;
};

/**
 * Gets the validator id of an HTML element
 * @param element The HTML element
 * @returns The id, or null if it is not set
 */
export const getElementId = (element:HTMLElement):string =>
{
	return element.getAttribute(ID_DOM_ATTRIBUTE) || null;
};

/**
 * Creates a new field and stores it in the [[fields]] map so it can be saved for later
 * retrieval.
 * @param id
 * @returns {Field}
 */
export const createField = (id:string):Field =>
{
	fields[id] = new Field(id);
	return fields[id];
};

/**
 * Gets a Field instance with the given id
 * @param id The id to lookup
 * @returns The field instance. null if no such field instance exists
 */
export const getField = (id:string):Field =>
{
	return fields[id] || null;
};
