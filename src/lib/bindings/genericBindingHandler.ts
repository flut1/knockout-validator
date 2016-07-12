import ko from 'knockout';
import ValidatorFieldBinding from "./ValidatorFieldBinding";
import {bindings, SHORTHAND_BINDING_NAME} from "../const/bindings";
import {getElementId, setElementId, createField} from "./elementMapper";

type BindingDescriptor = {
	value : any,
	binding : ValidatorFieldBinding
};

const getAllBindingValues = (element:HTMLElement, allBindingsAccessor: ko.AllBindingsAccessor, bindingContext: ko.BindingContext<any>):{[name:string]:BindingDescriptor} =>
{
	const shorthandValues = allBindingsAccessor.get(SHORTHAND_BINDING_NAME) || {};
	const allBindings:{[name:string]:BindingDescriptor} = {};

	if(ko.isObservable(shorthandValues))
	{
		throw new TypeError(`Passing an observable for the '${SHORTHAND_BINDING_NAME}' binding is not allowed. 
		See the API docs for '${SHORTHAND_BINDING_NAME}' for more information.`);
	}

	bindings.forEach(binding => {
		const bindingValue = allBindingsAccessor.get(binding.bindingName);
		if(bindingValue)
		{
			allBindings[binding.bindingName] = {
				value : bindingValue,
				binding
			};
		}
		else if(shorthandValues[binding.bindingShorthand])
		{
			allBindings[binding.bindingName] = {
				value : shorthandValues[binding.bindingShorthand],
				binding
			};
		}
		else if(binding.inheritFromContextProp && bindingContext[binding.inheritFromContextProp])
		{
			allBindings[binding.bindingName] = {
				value : bindingContext[binding.inheritFromContextProp],
				binding
			};
		}
		else if(binding.inheritFromAttribute && element.hasAttribute(binding.inheritFromAttribute))
		{
			allBindings[binding.bindingName] = {
				value : element.getAttribute(binding.inheritFromAttribute),
				binding
			};
		}

	});

	return allBindings;
};

export const getValueBindingKey = (element:HTMLElement, hasValueBinding:boolean):string =>
{
	const tagName = element.tagName.toLowerCase();
	const typeAttr = element.getAttribute('type');
	let valueBindingKey = 'value';

	if(tagName === 'input')
	{
		if(typeAttr === 'radio')
		{
			throw new Error(`Cannot apply validation bindings directly to radio buttons. Please use the
'validateRadio' binding to validate radio buttons.`);
		}
		else if(typeAttr === 'checkbox')
		{
			valueBindingKey = 'checked';
		}
	}
	else if(tagName === 'select')
	{
		if(element.hasAttribute('multiple'))
		{
			if(hasValueBinding)
			{
				throw new Error(`Please do not use the value bindings with a multiple-option select element.
Use the selectedOptions binding instead.`);
			}
			valueBindingKey = 'selectedOptions';
		}
	}
	else if(tagName !== 'textarea')
	{
		throw new Error(`Cannot apply validation bindings to unsupported <${tagName}> element.`)
	}

	return valueBindingKey;
};

export const createValueBinding = (element:HTMLElement, allBindingsAccessor: ko.AllBindingsAccessor, viewModel:any, bindingContext: ko.BindingContext):ko.Observable<any> =>
{
	const hasValueBinding = allBindingsAccessor.has('value');
	const valueBindingKey = getValueBindingKey(element, hasValueBinding);
	let value = allBindingsAccessor.get(valueBindingKey);

	if(typeof value === 'undefined')
	{
		value = ko.observable('');
		ko.bindingHandlers[value].init(element, () => value, allBindingsAccessor, viewModel, bindingContext);
	}
	else
	{
		if(!ko.isWritableObservable(value))
		{
			throw new Error(`knockout-validator does not work on elements that have a "${valueBindingKey}" binding with a 
value that is not a writable observable.`);
		}
	}

	return value;
};

export default (
	isInit:boolean, bindingName:string,
	element: any, valueAccessor: () => any, allBindingsAccessor: ko.AllBindingsAccessor, viewModel: any, bindingContext: ko.BindingContext<any>
):ko.BindingHandlerControlsDescendant|void =>
{
	let id = getElementId(element);

	if(isInit)
	{
		if(!id)
		{
			id = setElementId(element);
			const bindingValues = getAllBindingValues(element, allBindingsAccessor, bindingContext);

			if(bindingValues['validationName'])
			{
				const field = createField(id);
				const value = createValueBinding(element, allBindingsAccessor, viewModel, bindingContext);
				field.value = value;
				Object.keys(bindingValues).forEach(bindingName =>
				{
					const bindingDescriptor:BindingDescriptor = bindingValues[bindingName];
					field[bindingDescriptor.binding.validatorFieldProp] = ko.unwrap(bindingDescriptor.value);
				});
			}
		}
	}
}
