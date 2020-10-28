// https://gist.github.com/danharper/ad6ca574184589dea28d
const CANCEL = Symbol();

class CancellationTokenImplementation
    implements CancellationTokenImplementation {
    private _cancelled: boolean;

    constructor() {
        this._cancelled = false;
    }

    /** @throws {OperationCanceledException} if isCancellationRequested is true */
    throwIfCancellationRequested() {
        if (this.isCancellationRequested()) {
            throw OperationCanceledException;
        }
    }

    isCancellationRequested() {
        return this._cancelled;
    }

    [CANCEL]() {
        this._cancelled = true;
    }

    // could probably do with a `register(func)` method too for cancellation callbacks
}

export default class CancellationTokenSource {
    private _token: CancellationTokenImplementation;
    constructor() {
        this._token = new CancellationTokenImplementation();
    }

    public get isCancellationRequested(): boolean {
        return this._token.isCancellationRequested();
    }

    getToken(): CancellationToken {
        return this._token;
    }

    cancel() {
        this._token[CANCEL]();
    }
}

/* stolen from typescript.d.ts */
export class OperationCanceledException {}
export interface CancellationToken {
    isCancellationRequested(): boolean;
    /** @throws OperationCanceledException if isCancellationRequested is true */
    throwIfCancellationRequested(): void;
}
