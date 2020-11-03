import Util from "./util";

export default class BirdFacts {
    static facts: Map<string, string> = new Map();
    private doneFacts: Set<string> = new Set();

    private static initialized = false;

    static init(): void {
        if (this.initialized) {
            return;
        }
        this.initialized = true;
        this.facts.set(
            "windows",
            "Around 600 million birds\ndie from crashing into\nwindows every year\nin the US alone."
        );
        this.facts.set(
            "GOOSE",
            "The first bird\ndomesticated by humans\nwas the goose."
        );
        this.facts.set(
            "mock",
            "Mockingbirds can imitate\nmany sounds, from a\nsqueaking door to a\ncat meowing."
        );
        this.facts.set(
            "radio",
            "Around one third of all\nbird owners turn on a\nradio for their bird when\nthey leave the house."
        );
        this.facts.set(
            "owl",
            "Owls turn their heads\nalmost 360° but they\ncannot move their eyes."
        );
        this.facts.set(
            "condor",
            "California condors'\nwingspans are so big,\nthey're sometimes mistook\nfor small airplanes."
        );
        this.facts.set(
            "pigeon",
            "Pigeons can use touch\nscreens, read books, and\nrecognize humans."
        );
        this.facts.set(
            "species",
            "There are over 9,500\nspecies of birds in\nthe world."
        );
        this.facts.set(
            "feathers",
            "The bird with the most\nfeathers is the whistling\nswan, with up to 25,000\nfeathers."
        );
        this.facts.set(
            "weight",
            "A bird’s feathers weigh\nmore than its skeleton."
        );
        this.facts.set(
            "ostrich",
            "The ostrich is the only\nbird that willingly\ntakes care of other\nfemales’ eggs."
        );
        this.facts.set(
            "falcon",
            "The fastest flying bird\nis the Peregrine\nFalcon. It averages\nspeeds of over 320 kph."
        );
        this.facts.set(
            "parakeet",
            'The word "parakeet"\nliterally means\n"long tail."'
        );
        this.facts.set(
            "murder",
            "A group of crows is\ncalled a murder\nor congress."
        );
        this.facts.set(
            "study",
            "A group of owls is\ncalled a parliament,\nwisdom, or study."
        );
        this.facts.set(
            "flamboyance",
            "A group of flamingos\nis called a\nflamboyance."
        );
        this.facts.set(
            "cassowary",
            "The Cassowary can kill\nits enemy in one kick."
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

        return BirdFacts.facts.get(key);
    }
}
