import EventEmitter from "node:events";
import {EventMap} from "../bot";

export interface Recipient {

}

export abstract class Notifier<Events extends EventMap<Events>, RecipientType extends Recipient> {

    protected readonly recipient: RecipientType;

    readonly #handlers: {
        [E in keyof Events]?: (...args: Events[E]) => void
    } = {};

    constructor(recipient: RecipientType) {
        this.recipient = recipient;
    }

    addHandler<E extends keyof Events>(event: E, handler: (...args: Events[E]) => void) {
        this.#handlers[event] = handler;
    }

    listen(emitter: EventEmitter) {
        for (const event in this.#handlers) {
            const handler = this.#handlers[event];
            if (!handler) {
                continue;
            }
            emitter.on(event, handler);
        }
    }

}
