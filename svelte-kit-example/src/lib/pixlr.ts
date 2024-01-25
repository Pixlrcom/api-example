type Message = { op: 'connect' }
             | { op: 'open', buffer: ArrayBuffer, name: string };

abstract class  Application {
    protected constructor(protected port: MessagePort) {}

    /**
     * Open an image file
     * This function an async generator, so it will produce new images everytime the user saves the opened image
     * The iterator closes when the user closes the file in the editor
     * @param file The file to open, should be an image file
     */
    public async *open(file: File) {
        const buffer = await file.arrayBuffer();
        const port = this.sendMessage({ op: 'open', buffer, name: file.name}, [buffer]);
        
        const iter = new MessageIterator(port);

        for await (const message of iter) {
            yield message.data as File;
        }
    }

    private sendMessage(msg: Message, transfer: Transferable[]): MessagePort {
        const { port1, port2 } = new MessageChannel();
        this.port.postMessage(msg, [port2, ...transfer]);
        return port1;
    }
}

export interface OpenOptions {
    baseUrl?: string,
}

/**
 * A proxy class to control an embeded Editor
 */
export class Editor extends Application {
    /**
     * Open and connect to an instance of Pixlr editor in the target iframe
     * @param token JWT token to use for API access
     * @param target The iframe to open the editor in
     * @param options Open settings, NOT editor settings
     * @returns An instance of this class that can talk to the embeded editor
     */
    public static async connect(token: string, target: HTMLIFrameElement, options: OpenOptions = {}): Promise<Editor> {
        const baseUrl = options?.baseUrl ?? 'https://pixlr.com';        

        const ready = new Promise<MessagePort>((resolve, reject) => {
            target.addEventListener('load', () => {
                const { port1, port2 } = new MessageChannel();

                port1.onmessage = (event: MessageEvent) => {
                    if (event.data?.op === 'connected') resolve(port1)
                    else reject(new Error('Unexpectcd init message from Applicaton'))

                    port1.onmessage = null;
                };

                target.contentWindow?.postMessage({ op: 'connect'}, baseUrl, [port2]);
            }, { once: true });
        });

        const url = new URL(baseUrl);
        url.pathname = 'editor/';
        url.searchParams.append('token', token);

        target.src = url.toString();

        // Wait for the site to post a message or fail after a minute
        const port = await Promise.race([
            ready,
            timeout(10_000).then(() => { throw new Error('timeout') })
        ]);
        
        return new Editor(port);
    }
}

function timeout(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * A simple class that implements Promise but can be resolved/rejected by calling instance members instead of callbacks in the 
 * constructor, sometimes useful when the dataflow can't easily be expressed with the default and recommended way of making Promises
 */
class MutablePromise<T, E = any> implements Promise<T> {

    private promise: Promise<T>;

    // Note in the ignore: they are set in the constructor but 
    // Typescript does not understand the execution flow of the Promise constructor where they are set
    //@ts-ignore 
    resolve: (data: T) => void;
    //@ts-ignore
    reject: (reason: E) => void;
    
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }   

    // @ts-ignore
    [Symbol.toStringTag]: '[object MutablePromise]';

    then<TResult1 = T, TResult2 = never>(onfulfilled?: (value: T) => TResult1 | PromiseLike<TResult1>, onrejected?: (reason: any) => TResult2 | PromiseLike<TResult2>): Promise<TResult1> {
        return this.promise.then(onfulfilled, onrejected) as Promise<TResult1>;
    }

    catch<TResult>(onrejected?: (reason: any) => TResult | PromiseLike<TResult>): Promise<TResult> {
        return this.promise.catch(onrejected) as Promise<TResult>;
    }

    finally(onfinally: () => void): Promise<T> {
        return this.promise.finally(onfinally);
    }
}

class MessageIterator implements AsyncIterator<MessageEvent<any>> {

    private queue: MutablePromise<IteratorResult<MessageEvent<any>>, DOMException>[];
    private done: Promise<IteratorResult<MessageEvent<any>>>[];

    constructor(port: MessagePort) {
        this.queue = [];
        this.done = [];

        port.onmessage = (event) => {
            const out = event.data === 'close' ? 
                { done: true, value: event } :
                { done: false, value: event };

            if (this.queue.length > 0) {
                const [first] = this.queue.splice(0, 1);
                first.resolve(out);
            } else {
                this.done.push(Promise.resolve(out));
            }
        }
    }

    next(...args: [] | [undefined]): Promise<IteratorResult<MessageEvent<any>, any>> {
        if (this.done.length > 0) {
            const [p] = this.done.splice(0, 1);
            return p;
        }

        // We don't have data in the buffer, we have to wait
        const p = new MutablePromise<IteratorResult<MessageEvent<any>>, DOMException>();
        this.queue.push(p)
        return p;
    }

    //@ts-ignore
    [Symbol.asyncIterator]() {
        return this;
    }

}