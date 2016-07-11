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

export default (
	isUpdate:boolean, bindingName:string,
	element: any, valueAccessor: () => any, allBindingsAccessor: ko.AllBindingsAccessor, viewModel: any, bindingContext: ko.BindingContext<any>
):ko.BindingHandlerControlsDescendant|void =>
{
	let id = getElementId(element);

	if(!isUpdate)
	{
		if(!id)
		{
			id = setElementId(element);
			const bindingValues = getAllBindingValues(element, allBindingsAccessor, bindingContext);

			if(bindingValues['validationName'])
			{
				const field = createField(id);
			}
		}
	}

}
