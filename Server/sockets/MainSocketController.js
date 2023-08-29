/**
 * Class to begin socket communication.
 * */

class MainSocketController {

    static #bean;
    #io;
    #listeners;

    constructor(io) {
        this.#io = io;
        this.#listeners = {};
        this.#listen();
        this.constructor.#bean = this;
    }

    #listen() {
        this.#io.on("connection", (socket) => {
            socket.on('handshake_hello', userId => {
                log.trace('Connected to socket!', userId)
                socket.join(userId);
                socket.join('all');
                log.trace('Reply ready.', userId)
                socket.emit('handshake_reply', JSON.stringify({success: true, userId, action: 'JOIN'}));
            });
            socket.on('handshake_bye', userId => {
                socket.leave(userId);
                socket.leave('all');
                socket.emit('handshake_reply', JSON.stringify({success: true, userId, action: 'LEAVE'}));
            });
            socket.on('event', message => {
                let parsed = JSON.parse(message);
                this.#triggerEvent(parsed.event, parsed.data, parsed.userId);
            });
            socket.on('chat_message', message => {
                let parsed = JSON.parse(message);
                this.sendMessageToUser(parsed.toId, parsed);
            });
        });
    }

    #triggerEvent(eventName, data, userId) {
        if (this.#listeners[eventName]) return this.#listeners[eventName].forEach(listener => {
            try {
                listener(data, userId);
            } catch (c) {
                log.warn('Unable to invoke listener.', c.message, listener);
            }
        });
    }

    registerEventListener(eventName, callback) {
        this.#listeners = this.#listeners[eventName] || [];
        this.#listeners[eventName].push(callback);
        return this.#listeners[eventName].length - 1;
    }

    removeListeners(eventName) {
        this.#listeners[eventName] = [];
    }

    deregister(eventName, addCtx) {
        this.#listeners[eventName][addCtx] = null;
    }

    sendMessageToAll(messageObj, eventName) {
        log.trace('Sending socket message to all...', messageObj);
        this.#io.to('all').emit(eventName || messageObj.type, JSON.stringify(messageObj));
    }

    sendMessageToUser(userId, messageObj, eventName) {
        this.#io.to(userId).emit(eventName || 'direct_message', JSON.stringify(messageObj));
    }

    static get bean() {
        if (this.#bean) return this.#bean;
        throw new Error('Trying to work with sockets, but sockets not initialized yet. Please invoke post initialization.');
    }

    static get instance() {
        return this.bean;
    }

}

exports = module.exports = MainSocketController;
