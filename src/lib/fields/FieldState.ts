import RuleState from "../rules/RuleState";
import * as ko from 'knockout';

export default class FieldState extends RuleState
{
	constructor(public name:string,
	            public validate:() => Promise<boolean>,
	            public rule:(name:string) => RuleState,
	            public value:ko.Observable<any>,
	            public isValidated:ko.PureComputed<boolean>,
	            public validatedValue:ko.PureComputed<any>,
	            isValidating:ko.PureComputed<boolean>,
	            isValid:ko.Observable<boolean>)
	{
		super(isValidating, isValid);
	}
}
