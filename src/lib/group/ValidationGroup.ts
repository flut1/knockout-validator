import IValidatable from "../interface/IValidatable";
import * as ko from 'knockout';

export default class ValidationGroup implements IValidatable {

	public isValid:ko.PureComputed<boolean>;
	public isValidated:ko.PureComputed<boolean>;
	public isValidating:ko.PureComputed<boolean>;

	public validate(value?:any):Promise<boolean>
	{
		return null;
	}

	public clearValidation():void
	{
	}
}
