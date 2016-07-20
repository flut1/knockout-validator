import * as ko from 'knockout';

interface IValidatable {
	validate():Promise<boolean>;
	clearValidation():void;
	isValid:ko.PureComputed<boolean>|ko.Observable<boolean>;
	isValidated:ko.PureComputed<boolean>;
	isValidating:ko.PureComputed<boolean>;
}

export default IValidatable;
