/**
 * Struct holding data to invoke event within the pub-sub system.
 * 
 * @param {String} eveName - Name of event
 * @param {Function} cb - Generic function to call when event invoked
 * @param {Array<Subscriber>} subs - List of Subscriber Structs
 */
export function PSEvent (eveName, cb, subs = undefined) {
    this.eveName = eveName;
    this.subs = subs;
    this.cb = cb;
}

/**
 * Struct holding data to identify subscriber within pub-sub system
 * 
 * @param {String} name - Name to identify Subscriber with
 * @param {Object} obj - Object to mutate with event
 */
export function Subscriber (name, obj) {
    this.name = name;
    this.sub = obj;
}

/**
 * Object that carries actions to pubsub worker
 * 
 * @param {String} action - Action to send to Pub-Sub
 * @param {String} event - Event to invoke at Pub-Sub
 * @param {Any} data - For publishing this is data. For sub this is a subscriber;
 */
export function Action (event, message, data, action = "publish") {
    this.action = action;
    this.event = event;

    if (action.indexOf("subscribe") !== -1) {
        // Usually try not to do this, but the <T> is neccessary
        if(data.constructor.name === "Subscriber") 
            return Error("Subscribe requires a Subscriper Struct");
        this.sub = data;
    }

    if (!Object.getOwnPropertyDescriptor(data, "message")) {
        Object.assign(data, {message: message});
    }
    this.data = data
}