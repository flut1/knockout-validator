import * as ko from 'knockout';

interface IValidatable {
	validate(value?:any):Promise<boolean>;
	clearValidation():void;
	isValid:ko.PureComputed<boolean>;
	isValidated:ko.PureComputed<boolean>;
	isValidating:ko.PureComputed<boolean>;
}

export default IValidatable;
