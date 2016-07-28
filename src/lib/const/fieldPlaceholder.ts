import Field from '../fields/Field';
import * as ko from 'knockout';

const fieldPlaceholder:Field = new Field(
	'-1',
	null
);
fieldPlaceholder.value = ko.observable<any>(null);
fieldPlaceholder.rule = () => true;
fieldPlaceholder.name = null;

export default fieldPlaceholder;
