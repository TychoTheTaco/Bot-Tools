import {EventMap} from "../bot";
import {Notifier, Recipient} from "./notifier";

export interface DiscordRecipient extends Recipient {
    webhookUrl: string
}

export abstract class BaseDiscordNotifier<Events extends EventMap<Events>> extends Notifier<Events, DiscordRecipient> {

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
