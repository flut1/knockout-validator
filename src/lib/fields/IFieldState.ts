import * as ko from 'knockout';

interface IRuleState {
	isValidating:ko.Computed<boolean>;
	isValid:ko.Computed<boolean>;
	isValidated:ko.Computed<boolean>;
	value:ko.Computed<any>;
	validatedValue:ko.Computed<any>;
}

interface IFieldState extends IRuleState {
	validate:() => boolean;
	rule:(name:string) => IRuleState;
	name:string;
}

export default IFieldState;
