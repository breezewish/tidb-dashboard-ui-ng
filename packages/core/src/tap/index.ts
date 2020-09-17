// This is something similar to https://github.com/webpack/tapable
// However it supports removing listeners to fulfill our demand.

// TODO: Extract to a npm package

export type UntapFn = () => void

export type Listener<T, R> = (arg: T) => R

abstract class BaseHook<T, R> {
  protected listeners = new Set<Listener<T, R>>()

  protected _tap(fn: Listener<T, R>): UntapFn {
    this.listeners.add(fn)
    return this._untap.bind(this, fn)
  }

  protected _tapOnce(fn: Listener<T, R>) {
    const off = this._tap((arg) => {
      off()
      return fn(arg)
    })
  }

  protected _untap(fn: Listener<T, R>) {
    this.listeners.delete(fn)
  }
}

abstract class BaseAsyncHook<T, R> extends BaseHook<T, Promise<R>> {
  public tapAsync(fn: Listener<T, Promise<R>>): UntapFn {
    return this._tap(fn)
  }

  public tapAsyncOnce(fn: Listener<T, Promise<R>>) {
    return this._tapOnce(fn)
  }

  public untapAsync(fn: Listener<T, Promise<R>>) {
    return this._untap(fn)
  }

  public abstract async invokeAsync(arg: T): Promise<R>
}

/**
 * Run listeners in parallel, return when all listeners are finished.
 * When error happens, error will be thrown immediately.
 */
export class AsyncParallelHook<T> extends BaseAsyncHook<T, void> {
  public async invokeAsync(arg: T): Promise<void> {
    const staticListeners = [...this.listeners]
    await Promise.all(
      staticListeners.map(async (l) => {
        return await l(arg)
      })
    )
  }
}

/**
 * Run listeners in parallel, early return when first value is available.
 * When error happens, error will be thrown immediately.
 */
export class AsyncParallelBailHook<T, R> extends BaseAsyncHook<T, R | void> {
  public invokeAsync(arg: T): Promise<R | void> {
    const staticListeners = [...this.listeners]
    return new Promise((resolve, reject) => {
      let resolved = 0
      const expectResolved = staticListeners.length
      staticListeners.forEach((l) => {
        l(arg)
          .then((r) => {
            resolved++
            if (r !== undefined) {
              resolve(r)
            } else if (resolved === expectResolved) {
              resolve(undefined)
            }
          })
          .catch((err) => {
            reject(err)
          })
      })
    })
  }
}

/**
 * Run listeners in series, return when all listeners are finished.
 * When error happens, error will be thrown immediately and other listeners
 * are skipped.
 */
export class AsyncSeriesHook<T> extends BaseAsyncHook<T, void> {
  public async invokeAsync(arg: T): Promise<void> {
    const staticListeners = [...this.listeners]
    for (const l of staticListeners) {
      if (this.listeners.has(l)) {
        await l(arg)
      }
    }
  }
}

/**
 * Run listeners in series, early return when first value is available and
 * other listeners are skipped.
 * When error happens, error will be thrown immediately and other listeners
 * are skipped.
 */
export class AsyncSeriesBailHook<T, R> extends BaseAsyncHook<T, R | void> {
  public async invokeAsync(arg: T): Promise<R | void> {
    const staticListeners = [...this.listeners]
    for (const l of staticListeners) {
      if (this.listeners.has(l)) {
        const r = await l(arg)
        if (r !== undefined) {
          return r
        }
      }
    }
  }
}

abstract class BaseSyncHook<T, R> extends BaseHook<T, R> {
  public tapSync(fn: Listener<T, R>): UntapFn {
    return this._tap(fn)
  }

  public tapSyncOnce(fn: Listener<T, R>) {
    return this._tapOnce(fn)
  }

  public untapSync(fn: Listener<T, R>) {
    return this._untap(fn)
  }

  public abstract invokeSync(arg: T): R
}

/**
 * Run sync listeners in series.
 * When error happens, error will be thrown immediately and other listeners
 * are skipped.
 */
export class SyncSeriesHook<T> extends BaseSyncHook<T, void> {
  public invokeSync(arg: T): void {
    const staticListeners = [...this.listeners]
    for (const l of staticListeners) {
      if (this.listeners.has(l)) {
        l(arg)
      }
    }
  }
}

/**
 * Run sync listeners in series, early return when first value is available and
 * other listeners are skipped.
 * When error happens, error will be thrown immediately and other listeners
 * are skipped.
 */
export class SyncSeriesBailHook<T, R> extends BaseSyncHook<T, R | void> {
  public invokeSync(arg: T): R | void {
    const staticListeners = [...this.listeners]
    for (const l of staticListeners) {
      if (this.listeners.has(l)) {
        const r = l(arg)
        if (r !== undefined) {
          return r
        }
      }
    }
  }
}
