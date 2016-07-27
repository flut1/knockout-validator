import * as ko from 'knockout';

const disposeSubscriptionArray = (subscriptionArray:Array<ko.subscription<any>>):void =>
{
	subscriptionArray.forEach(subscription => subscription.dispose());
	subscriptionArray.length = 0;
};

export default disposeSubscriptionArray;
