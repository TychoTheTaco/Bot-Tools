import EventEmitter from "node:events";
import {EventMap} from "../bot";

interface Recipient {

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

export interface DiscordRecipient extends Recipient {
    webhookUrl: string
}

export abstract class DiscordNotifier<Events extends EventMap<Events>> extends Notifier<Events, DiscordRecipient> {

    constructor(recipient: DiscordRecipient) {
        super(recipient);
    }

    protected async post(data: object) {
        return fetch(this.recipient.webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
    }

}
