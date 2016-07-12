import ko from 'knockout';
import genericBindingHandler from './genericBindingHandler';
import {bindings, SHORTHAND_BINDING_NAME} from "../const/bindings";

const getBindingHandlers:ko.BindingHandler = name => ({
	init : () => genericBindingHandler(true, name, ...arguments),
	update : () => genericBindingHandler(false, name, ...arguments)
});

const createBindings = (target:Object):void =>
{
	bindings.forEach(binding => target[binding.bindingName] = getBindingHandlers(binding.bindingName));
	target[SHORTHAND_BINDING_NAME] = getBindingHandlers(SHORTHAND_BINDING_NAME);
};

export default createBindings;
