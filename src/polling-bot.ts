import EventEmitter from "node:events";

export interface PollingBotOptions {
    pollingIntervalMinutes?: number
}

export interface PollingBotEvents {
    "started": () => void,
    "stopped": () => void,
    "before-update": () => void,
    "after-update": () => void,
}

export declare interface PollingBot<OptionsType extends PollingBotOptions> {

    on<E extends keyof PollingBotEvents>(event: E, listener: PollingBotEvents[E]): this;

    emit<E extends keyof PollingBotEvents>(event: E, ...args: Parameters<PollingBotEvents[E]>): boolean;

}

export abstract class PollingBot<OptionsType extends PollingBotOptions> extends EventEmitter {

    /**
     *
     * @private
     */
    readonly #pollingIntervalMinutes: number = 60 * 2;

    /**
     *
     * @private
     */
    #timeout?: NodeJS.Timeout;

    constructor(options?: OptionsType) {
        super();
        this.#pollingIntervalMinutes = options?.pollingIntervalMinutes ?? this.#pollingIntervalMinutes;
    }

    async start(): Promise<void> {
        // Check if the bot is already started
        if (this.#timeout) {
            return;
        }

        // Notify listeners
        this.emit("started");

        // Start the bot
        const runWrapper = () => {
            this.emit("before-update");
            this.onPoll().catch(error => {
                //logger.error("Error running bot!");
                //logger.debug(error);
            }).finally(() => {
                this.emit("after-update");

                // Check if we should stop
                //if (this.#state === State.STOPPING) {
                //    this.#state = State.IDLE;
                //    this.emit("stopped");
                //    return;
                //}

                //logger.info(`Sleeping for ${this.#pollingIntervalMinutes} minutes...`);
                this.#timeout = setTimeout(runWrapper, 1000 * 60 * this.#pollingIntervalMinutes);
            });
        }
        runWrapper();
    }

    async stop(): Promise<void> {
        clearTimeout(this.#timeout);
        return new Promise((resolve, reject) => {
            this.on("stopped", resolve);
        });
    }

    abstract onPoll(): Promise<void>;

}
