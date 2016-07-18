import Field from "../fields/Field";

/**
 * The DOM attribute key used to save an id of a Field
 */
const ID_DOM_ATTRIBUTE = 'data-ko-validator-id';

/**
 * Util that keeps track of all registered knockout-validator fields in your application.
 * Only the exported elementMapper singleton instance should be used, this class is exported
 * for testing purposes.
 */
export class ElementMapper
{
	/**
	 * Counter to assign unique ids to each validator
	 */
	private _idCounter:number = 1;

	/**
	 * Static map of each field by id. Is used to lookup fields based on the id saved
	 * on the corresponding HTML element.
	 */
	private _fields:{[id:string]:Field} = {};

	/**
	 * Generates a new id for an HTML element and sets it as an attribute on the element
	 * @param element The element to generate an id for
	 * @returns The generated id
	 */
	public setElementId = (element:HTMLElement):string =>
	{
		const id = (this._idCounter++).toString();
		element.setAttribute(ID_DOM_ATTRIBUTE, id);
		return id;
	};

	/**
	 * Gets the validator id of an HTML element
	 * @param element The HTML element
	 * @returns The id, or null if it is not set
	 */
	public getElementId = (element:HTMLElement):string =>
	{
		return element.getAttribute(ID_DOM_ATTRIBUTE) || null;
	};

	/**
	 * Creates a new field and stores it in the [[fields]] map so it can be saved for later
	 * retrieval.
	 * @param id
	 * @returns {Field}
	 */
	public createField = (id:string):Field =>
	{
		this._fields[id] = new Field(id);
		return this._fields[id];
	};

	/**
	 * Gets a Field instance with the given id
	 * @param id The id to lookup
	 * @returns The field instance. null if no such field instance exists
	 */
	public getField = (id:string):Field =>
	{
		return this._fields[id] || null;
	};

	/**
	 * Removes a field with the given id from the internal map of fields
	 * @param id The id of the field to remove
	 */
	removeField = (id:string):void =>
	{
		if(!this._fields[id])
		{
			throw new Error(`Trying to remove a field with non-existing id "${id}"`);
		}
	}
}

/**
 * Singleton element mapper instance to maintain global state of all knockout-validator
 * elements.
 */
const elementMapper = new ElementMapper();

export default elementMapper;
