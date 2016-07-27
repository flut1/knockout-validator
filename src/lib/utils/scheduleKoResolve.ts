import * as ko from 'knockout';

const scheduleKoResolve = <T>(result:T) => new Promise<T>((resolve) => ko.tasks.schedule(() => resolve(result)));

export default scheduleKoResolve;
