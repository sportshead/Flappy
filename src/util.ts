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

    static putIfAbsentSet<T>(set: Set<T>, value: T) {
        if (set.has(value)) {
            return value;
        } else {
            set.add(value);
        }
    }

    static putIfAbsentMap<K, V>(map: Map<K, V>, key: K, value: V) {
        if (map.has(key)) {
            return map.get(key);
        } else {
            map.set(key, value);
        }
    }

    static random(max: number, min: number = 0) {
        return Math.random() * (max - min) + min;
    }

    static randomInt(max: number, min: number = 0) {
        return ~~this.random(~~max, ~~min);
    }

    static center(str: string, canvas: HTMLCanvasElement, fontSize: number) {
        return canvas.width / 2 - (str.length * fontSize) / 2; // big brain
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
