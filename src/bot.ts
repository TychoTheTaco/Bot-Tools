import EventEmitter from "node:events";

export type BotOptions = { [key: string | symbol]: any }

type DefaultEventMap = {}
export type EventMap<T = DefaultEventMap> = Record<keyof T, any[]>

export interface BotEvents<OptionsType extends BotOptions, B extends Bot<OptionsType>> {
    "started": [bot: B],
    "stopped": [],
    "error": [data: any]
}

export declare interface Bot<OptionsType extends BotOptions> {

    emit<E extends keyof BotEvents<OptionsType, Bot<OptionsType>>>(event: E, ...args: BotEvents<OptionsType, Bot<OptionsType>>[E]): boolean;

    on<E extends keyof BotEvents<OptionsType, Bot<OptionsType>>>(event: E, listener: (...args: BotEvents<OptionsType, Bot<OptionsType>>[E]) => void): this;

}

export enum State {
    IDLE,
    RUNNING,
    STOPPING
}

export abstract class Bot<OptionsType extends BotOptions> extends EventEmitter {

    #state: State = State.IDLE;

    protected constructor(options?: OptionsType) {
        super();
    }

    async start(): Promise<void> {
        // Check if the bot is already started
        if (this.#state !== State.IDLE) {
            return;
        }

        // Update state
        this.#state = State.RUNNING;

        // Notify listeners
        this.emit("started", this);

        // Call lifecycle method
        await this.onStart();
    }

    async stop(): Promise<void> {
        // Update state
        this.#state = State.STOPPING;

        // Wait for the bot to stop
        await this.onStop();

        // Update state
        this.#state = State.IDLE;

        // Notify listeners
        this.emit("stopped");
    }

    async onStart(): Promise<void> {

    }

    async onStop(): Promise<void> {

    }

}
