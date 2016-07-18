import * as ko from 'knockout';

export default class RuleState {
	constructor(
		public isValidating:ko.PureComputed<boolean>,
		public isValid:ko.Observable<boolean>,
		public isValidated:ko.PureComputed<boolean>,
		public value:ko.Observable<any>,
		public validatedValue:ko.PureComputed<any>
	)
	{

	}
}
