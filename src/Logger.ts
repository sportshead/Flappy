import Util from "./util";
export default class Logger {
    outputs: LogOutput[];
    constructor(...outputs: LogOutput[]) {
        this.outputs = outputs;
    }

    addLogOutput(output: LogOutput) {
        this.outputs.push(output);
    }

    log(level: Level, ...messages: any) {
        const date = new Date();
        this.outputs.forEach((l) => l.log(date, level, ...messages));
    }

    trace(...messages: any) {
        this.log(Level.TRACE, ...messages);
    }
    debug(...messages: any) {
        this.log(Level.DEBUG, ...messages);
    }
    info(...messages: any) {
        this.log(Level.INFO, ...messages);
    }
    warn(...messages: any) {
        this.log(Level.WARN, ...messages);
    }
    error(...messages: any) {
        this.log(Level.ERROR, ...messages);
    }
    fatal(...messages: any) {
        this.log(Level.FATAL, ...messages);
    }
}

class StandardLevel {
    static readonly OFF = new StandardLevel(0);
    static readonly FATAL = new StandardLevel(100);
    static readonly ERROR = new StandardLevel(200);
    static readonly WARN = new StandardLevel(300);
    static readonly INFO = new StandardLevel(400);
    static readonly DEBUG = new StandardLevel(500);
    static readonly TRACE = new StandardLevel(600);
    static readonly ALL = new StandardLevel(Number.MAX_VALUE);
    private static readonly LEVELSET: Set<StandardLevel> = new Set([
        StandardLevel.OFF,
        StandardLevel.FATAL,
        StandardLevel.ERROR,
        StandardLevel.WARN,
        StandardLevel.INFO,
        StandardLevel.DEBUG,
        StandardLevel.TRACE,
        StandardLevel.ALL,
    ]);

    constructor(private _intLevel: number) {}

    public intLevel() {
        return this._intLevel;
    }

    public static getStandardLevel(intLevel: number): StandardLevel {
        let level: StandardLevel = this.OFF;

        for (const lvl of this.LEVELSET) {
            if (lvl.intLevel() > intLevel) {
                break;
            }
            level = lvl;
        }
        return level;
    }
}

export class Level {
    private static readonly LEVELS: Map<string, Level> = new Map([]);

    //#region standardLevels
    static readonly OFF: Level = new Level("OFF", StandardLevel.OFF.intLevel());
    static readonly FATAL: Level = new Level(
        "FATAL",
        StandardLevel.FATAL.intLevel()
    );
    static readonly ERROR: Level = new Level(
        "ERROR",
        StandardLevel.ERROR.intLevel()
    );
    static readonly WARN: Level = new Level(
        "WARN",
        StandardLevel.WARN.intLevel()
    );
    static readonly INFO: Level = new Level(
        "INFO",
        StandardLevel.INFO.intLevel()
    );
    static readonly DEBUG: Level = new Level(
        "DEBUG",
        StandardLevel.DEBUG.intLevel()
    );
    static readonly TRACE: Level = new Level(
        "TRACE",
        StandardLevel.TRACE.intLevel()
    );
    static readonly ALL: Level = new Level("ALL", StandardLevel.ALL.intLevel());
    //#endregion

    private readonly standardLevel: StandardLevel;

    private constructor(
        private readonly _name: string,
        private readonly _intLevel: number
    ) {
        if (_intLevel < 0) {
            throw "Illegal Level int less than zero.";
        }
        this.standardLevel = StandardLevel.getStandardLevel(_intLevel);
        if (Util.putIfAbsentMap(Level.LEVELS, _name, this) !== undefined) {
            throw "Level " + _name + " has already been defined.";
        }
    }

    public intLevel() {
        return this._intLevel;
    }

    public getStandardLevel() {
        return this.standardLevel;
    }

    public isInRange(minLevel: Level, maxLevel: Level) {
        return (
            this._intLevel >= minLevel._intLevel &&
            this._intLevel <= maxLevel._intLevel
        );
    }

    public get name(): string {
        return this._name;
    }

    public toString(): string {
        return this._name;
    }
}

export interface LogOutput {
    log(time: Date, level: Level, ...messages: any): void;
}

export class ConsoleLogOutput implements LogOutput {
    static readonly VERSION = "1.1.0";
    constructor(
        private readonly debugThreshold: number | Level = Level.ALL,
        private readonly logThreshold: number | Level = Level.INFO,
        private readonly warningThreshold: number | Level = Level.WARN,
        private readonly errorThreshold: number | Level = Level.ERROR
    ) {
        if (this.debugThreshold instanceof Level) {
            this.debugThreshold = this.debugThreshold.intLevel();
        }
        if (this.logThreshold instanceof Level) {
            this.logThreshold = this.logThreshold.intLevel();
        }
        if (this.warningThreshold instanceof Level) {
            this.warningThreshold = this.warningThreshold.intLevel();
        }
        if (this.errorThreshold instanceof Level) {
            this.errorThreshold = this.errorThreshold.intLevel();
        }

        this.log(
            new Date(),
            Level.INFO,
            "ConsoleLogOutput v" + ConsoleLogOutput.VERSION + " initialized."
        );
    }

    log(time: Date, level: Level, ...messages: any): void {
        if (level.intLevel() <= this.errorThreshold) {
            console.error(
                `[${time.toISOString()}] [${level.name}]:`,
                ...messages
            );
        } else if (level.intLevel() <= this.warningThreshold) {
            console.warn(
                `[${time.toISOString()}] [${level.name}]:`,
                ...messages
            );
        } else if (level.intLevel() <= this.logThreshold) {
            console.log(
                `[${time.toISOString()}] [${level.name}]:`,
                ...messages
            );
        } else if (level.intLevel() <= this.debugThreshold) {
            console.debug(
                `[${time.toISOString()}] [${level.name}]:`,
                ...messages
            );
        }
    }
}

export class AlertLogOutput implements LogOutput {
    constructor(private readonly logThreshold: number | Level) {
        if (this.logThreshold instanceof Level) {
            this.logThreshold = this.logThreshold.intLevel();
        }
    }

    log(time: Date, level: Level, ...messages: any): void {
        if (level.intLevel() <= this.logThreshold) {
            alert(
                `[${time.toISOString()}] [${level.name}]: ${messages.join(" ")}`
            );
        }
    }
}
