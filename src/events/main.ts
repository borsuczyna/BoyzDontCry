interface Event {
    name: string;
    priority: number;
    callback: CallableFunction;
};

const events: Event[] = [];

export function addEventListener(name: string, callback: CallableFunction, priority: number = 0): void {
    if(events.find(event => event.name === name && event.callback === callback)) return;

    events.push({
        name,
        priority,
        callback
    });
}

export function removeEventListener(name: string, callback: CallableFunction): void {
    events.splice(events.findIndex(event => event.name === name && event.callback === callback), 1);
}

export function triggerEvent(name: string, ...args: any[]): void {
    events.filter(event => event.name === name)
        .sort((a, b) => b.priority - a.priority)
        .forEach(event => event.callback(...args));
}