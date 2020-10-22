import Util from "./util";

export default class BirdFacts {
    static facts: Map<string, string> = new Map();
    private doneFacts: Set<string> = new Set();

    static init(): void {
        this.facts.set(
            "windows",
            "Around 600 million birds die from crashing into windows every year, in the US alone."
        );
    }

    getFact(): string {
        let key;
        if (this.doneFacts.size === BirdFacts.facts.size) {
            key = Util.getRandomKey(BirdFacts.facts);
        } else {
            do {
                key = Util.getRandomKey(BirdFacts.facts);
            } while (this.doneFacts.has(key));
            this.doneFacts.add(key);
        }

        return <string>BirdFacts.facts.get(key);
    }
}
