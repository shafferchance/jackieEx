// Does not polute local scope due to being in its own scope
let pubsub = new PubSub();

/**
 * This is a web worker, think of it as a thread on the web. It has an isolated scope away from the document and window models. Thus is must
 * communicate as an external object with messages. The event `onmessage` has an anonymous arrow functions (assign `this` context) that is 
 * invoked whenever the front-end sends a message to this Web Worker object. Utimately the reason I choose to do this is that you can pass 
 * data solely and allow the front end to react as you please.
 *  _________________                           ^         
 * |                 |                      /      \      T      
 * | Client (Player) | ---[Message]-----< pubsub exist? >---\
 * |_________________|        |             \      /     ___|___
 *                      ______|______           v       |       |
 *                     |             |        F |       |   GC  |
 *                     |    action   |          |       |_______|  _________________________________________         ^         _________________
 *                     |      obj    |          |           |     |                                         |     /     \   T |                 |
 *                                              \----->-----|-->--| Method router (switch-case conditional) |---<  Match  >---|  Execute action |
 *                                                                |_________________________________________|     \     /     |_________________|
 *                                                                                                                   v                 |
 *                                                                                                                   |  F              |
 *                                                                                                                [error]------>-------|
 *                                                                                                                                    \|/
 *                                                                                                                              _______|________
 *                                                                                                    __________               |                |
 *                                                                                                   |          |              |  Send Message  |
 *                                                                                                   |   wait   |-----<--------|    back to     |
 *                                                                                                   |__________|              |     client     |
 *                                                                                                                             |________________|
 */     

onmessage = e => {
    console.log(e.data);
    if (pubsub.eventQueue.length >= 10) {
        pubsub.garbageCollection();
    }
    switch (e.data["action"]) {
        case "appendPublisher":
            pubsub.addPublisher(e.data.data);
            break;
        case "removePublisher":
            pubsub.removePublisher(e.data.eveName);
            break;
        case "subscribe":
            pubsub.subscribe(e.data["event"], e.data["sub"]);
            break;
        case "unsubscribe":
            pubsub.unsubscribe(e.data["event"], e.data["sub"]);
            break;
        case "publish":
            pubsub.publish(e.data["event"], e.data["data"]);
            break;
        default:
            postMessage(e.data);
            return Error("Unsupported action passed");
    }
}

/**
 * 
 * @param {String} eveName - Name of the event 
 * @param {Array} subList - List of subscribers 
 * @param {Function} cb -  
 */
function PubSub () {
    this.eves = {};
    this.eventQueue = [];
}

/**
 * Will append a PSEvent struct into the Pub-Sub system
 * 
 * @param {PSEvent} eve - Pub-Sub event struct to append
 */
PubSub.prototype.addPublisher = function(eve) {
    console.log(eve);
    let funct = eve.cb.funct;
    let params = eve.cb.params;

    eve.cb = new Function(...params, funct);
    eve.subs = eve.subs === undefined ? [] : eve.subs;
    this.eves[eve.eveName] = eve;
    postMessage(eve.eveName);
}

/**
 * Will remove an added publisher object
 * 
 * @param {String} eveName - Name of publisher stored
 */
PubSub.prototype.removePublisher = function(eveName) {
    delete this.eves[eveName];
}

/**
 * 
 * @param {String} eveName - Name of event to invoke
 * @param {Subscriber} - Struct containing neccessary data for subscirber 
 */
PubSub.prototype.subscribe = function(eveName, sub) {
    this.eves[eveName]
        .subs[sub.name] = sub;
}

/**
 * 
 * @param {String} eveName - Name of event to search for subscriber in 
 * @param {Subsciber} - Holds the object to unsubscribe from the event
 */
PubSub.prototype.unsubscribe = function(eveName, sub) {
    delete this.eves[eveName]
               .subs[sub.name];
}

/**
 * This is to ensure that the jobs do not become a memory leak. Since they are assigned to an Array JS'own GC will
 * not clean them up since they are referenced inside the event queue. This will mark them as removable to the JS
 * engine's GC.
 */
PubSub.prototype.garbageCollection = function() {
    for (const [job, i] of this.eventQueue.entries()) {
        if (job.isFinished) this.eventQueue.splice(i, 1);
    }
}

/**
 * Will create a PublishEvent Struct and push it on the eventQueue this is allow the JS async handler to move on to 
 * the next synchronous execution as once the object is instantiated and the reference is pushed to the Array this
 * execution context is complete.
 * 
 * @param {PSEvent} eve - Object for the specific event fired
 * @param {Any} data - Any data
 */
PubSub.prototype.publish = function(eveName, data) {
    this.eventQueue.push(new PublishEvent(this.eves[eveName], data));
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------------
/**
 * This will be the object that contains job spun up by this system. Whilist this isn't purely functional it will get the job done
 * without the full on bloat of an ES6 class. As this will store the state of the Promise and allow it to be queryable. Normally this
 * is not possbile.
 * 
 * @param {PSEvent} eve - Will contain the event name, callback function (cb), and data to publish to all subscribers
 * @param {Any} data - This is any data type, since this JS it does not matter
 */
function PublishEvent (eve, data) {
    this.job = this.createJob(eve, data);
    this.finished = false;
    this.error = false;
}

/**
 * 
 * @param {PSEvent} eve - Will be the event object passed to the constructor there is no point in storing what is not needed as the point
 *                          of this wrapper to to return a queryable proimse
 * @param {Any} data - Same as the data passed in the construcutor
 */
PublishEvent.prototype.createJob = function(eve, data) {
    eve.cb("", data);
    /*let promises = [];
    for(const sub of eve.subs) {
        promises.push(eve.cb(sub, data));
    }
    return Promise.all(promises)
                    .then(() => {
                        this.finished = true;
                    })
                    .catch(err => {
                        this.error = err;
                    });*/
}

/**
 * This function will query the promise created based on the constructor
 */
PublishEvent.prototype.isFinished = function() {
    if (this.error) return Error(this.error);
    if (this.finished) return true;
}
