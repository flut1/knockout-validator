import * as ko from 'knockout';

export default class RuleState
{
	constructor(public isValidating:ko.PureComputed<boolean>,
	            public isValid:ko.Observable<boolean>)
	{

	}
}
