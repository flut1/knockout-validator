import * as ko from 'knockout';
import genericBindingHandler from './genericBindingHandler';
import {bindings, SHORTHAND_BINDING_NAME} from "../const/bindings";

const getBindingHandlers = (name:string):ko.BindingHandler => ({
	init : (element: any, valueAccessor: () => any, allBindingsAccessor: ko.AllBindingsAccessor, viewModel: any, bindingContext: ko.BindingContext<any>) =>
		genericBindingHandler(true, name, element, valueAccessor, allBindingsAccessor, viewModel, bindingContext),
	update : (element: any, valueAccessor: () => any, allBindingsAccessor: ko.AllBindingsAccessor, viewModel: any, bindingContext: ko.BindingContext<any>) =>
		genericBindingHandler(false, name, element, valueAccessor, allBindingsAccessor, viewModel, bindingContext),
});

const createBindings = (target:Object):void =>
{
	bindings.forEach(binding => target[binding.bindingName] = getBindingHandlers(binding.bindingName));
	target[SHORTHAND_BINDING_NAME] = getBindingHandlers(SHORTHAND_BINDING_NAME);
};

export default createBindings;
