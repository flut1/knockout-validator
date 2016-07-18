import RuleState from "../rules/RuleState";
import * as ko from 'knockout';

export default class FieldState extends RuleState
{
	constructor(public name:string,
	            public validate:() => Promise<boolean>,
	            public rule:(name:string) => RuleState,
	            isValidating:ko.PureComputed<boolean>,
	            isValid:ko.Observable<boolean>,
	            isValidated:ko.PureComputed<boolean>,
	            value:ko.Observable<any>,
	            validatedValue:ko.PureComputed<any>)
	{
		super(isValidating, isValid, isValidated, value, validatedValue);
	}
}
