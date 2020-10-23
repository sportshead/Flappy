export default class Util {
    static getRandomKey<K, V>(collection: Set<K> | Map<K, V>): K {
        const keys: K[] = Array.from(collection.keys());
        return keys[Math.floor(Math.random() * keys.length)];
    }

    static getRandomItem<K, V>(collection: Set<V> | Map<K, V>): V {
        const items: V[] = Array.from(collection.values());
        return items[Math.floor(Math.random() * items.length)];
    }

    static promiseEventListener(obj: Eventable, event: string): Promise<Event> {
        return new Promise((res) => {
            obj.addEventListener(event, function (e) {
                res(e);
            });
        });
    }

    static async getImage(url: string): Promise<HTMLImageElement> {
        const img = new Image();
        img.src = url;
        await this.promiseEventListener(img, "load");

        return img;
    }

    static LOG(message?: any, ...optionalParams: any[]): void {
        if (process.env.NODE_ENV === "production") {
            console.log(message, ...optionalParams);
        }
    }
}

export interface Eventable {
    addEventListener<K extends keyof ElementEventMap>(
        type: K,
        listener: (this: Element, ev: ElementEventMap[K]) => any,
        options?: boolean | AddEventListenerOptions
    ): void;
    addEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions
    ): void;
}
