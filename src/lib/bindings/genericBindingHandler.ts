import * as ko from 'knockout';
import ValidatorFieldBinding from "./ValidatorFieldBinding";
import {bindings, SHORTHAND_BINDING_NAME} from "../const/bindings";
import elementMapper from "./elementMapper";
import find from 'lodash.find';

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

export const getValueBindingKey = (element:HTMLElement):string =>
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
			valueBindingKey = 'selectedOptions';
		}
	}
	else if(tagName !== 'textarea')
	{
		throw new Error(`Cannot apply validation bindings to unsupported <${tagName}> element.`)
	}

	return valueBindingKey;
};

export const createValueBinding = (element:HTMLElement, allBindingsAccessor: ko.AllBindingsAccessor, viewModel:any, bindingContext: ko.BindingContext<any>):ko.Observable<any> =>
{
	const hasValueBinding = allBindingsAccessor.has('value');
	const valueBindingKey = getValueBindingKey(element);
	if(valueBindingKey == 'selectedOptions' && hasValueBinding)
	{
		throw new Error(`Please do not use the value bindings with a multiple-option select element.
Use the selectedOptions binding instead.`);
	}

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

const initField = (
	element: any, id:string, bindingValues:{[name:string]:BindingDescriptor},
	allBindingsAccessor: ko.AllBindingsAccessor, viewModel: any, bindingContext: ko.BindingContext<any>
):ko.BindingHandlerControlsDescendant|void =>
{
	const field = elementMapper.createField(id);
	const value = createValueBinding(element, allBindingsAccessor, viewModel, bindingContext);
	const addToContext:Array<any> = [];
	field.value = value;
	Object.keys(bindingValues).forEach(bindingName =>
	{
		const bindingDescriptor:BindingDescriptor = bindingValues[bindingName];
		field[bindingDescriptor.binding.validatorFieldProp] = ko.unwrap(bindingDescriptor.value);
		if(bindingDescriptor.binding.inheritFromContextProp)
		{
			addToContext.push(bindingDescriptor);
		}
	});

	ko.utils.domNodeDisposal.addDisposeCallback(element, function()
	{
		field.dispose();
	});

	if(addToContext.length)
	{
		const innerBindingContext = bindingContext.extend(addToContext.reduce(
			function(context:any, bindingDescriptor:BindingDescriptor)
			{
				context[bindingDescriptor.binding.inheritFromContextProp] = bindingDescriptor.value;
			}, {})
		);
		ko.applyBindingsToDescendants(innerBindingContext, element);
		return {controlsDescendantBindings : true};
	}

	return null;
};

export default (
	isInit:boolean, bindingName:string,
	element: any, valueAccessor: () => any, allBindingsAccessor: ko.AllBindingsAccessor, viewModel: any, bindingContext: ko.BindingContext<any>
):ko.BindingHandlerControlsDescendant|void =>
{
	let id = elementMapper.getElementId(element);

	if(isInit)
	{
		if(!id)
		{
			id = elementMapper.setElementId(element);

			if(!elementMapper.getField(id))
			{
				const bindingValues = getAllBindingValues(element, allBindingsAccessor, bindingContext);

				if(bindingValues['validationName'])
				{
					return initField(element, id, bindingValues, allBindingsAccessor, viewModel, bindingContext);
				}
			}
		}
	}
	else if(id)
	{
		const field = elementMapper.getField(id);

		if(field)
		{
			if(bindingName === SHORTHAND_BINDING_NAME)
			{
				const shorthandValues = ko.toJS(valueAccessor());

				bindings.forEach(binding =>
				{
					if(typeof shorthandValues[binding.bindingShorthand] !== 'undefined')
					{
						field[binding.validatorFieldProp] = shorthandValues[binding.bindingShorthand];
					}
				});
			}
			else
			{
				const value = ko.unwrap(valueAccessor());
				const binding:ValidatorFieldBinding = find(
					bindings,
					(b:ValidatorFieldBinding) => b.bindingName === bindingName
				);
				if(binding)
				{
					field[binding.validatorFieldProp] = value;
				}
			}
		}
	}

	return null;
}
