import Field from '../fields/Field';
import * as ko from 'knockout';

const fieldPlaceholder:Field = new Field(
	'-1'
);
fieldPlaceholder.value = ko.observable<any>(null);
fieldPlaceholder.ruleBindingValue = function() {};
fieldPlaceholder.name = null;

export default fieldPlaceholder;
