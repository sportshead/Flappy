export default class Util {
    static getRandomKey<K, V>(collection: Set<K> | Map<K, V>): K {
        const keys: K[] = Array.from(collection.keys());
        return keys[Math.floor(Math.random() * keys.length)];
    }

    static getRandomItem<K, V>(collection: Set<V> | Map<K, V>): V {
        const items: V[] = Array.from(collection.values());
        return items[Math.floor(Math.random() * items.length)];
    }
}
