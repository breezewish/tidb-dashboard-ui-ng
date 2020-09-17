import { BaseService } from '@core/services/Base'
import type { ServicesContainer } from '@core/services/Container'
import { AsyncParallelHook } from '@core/tap'

export interface IApp {
  getId(): string
  onRegister?: (container: ServicesContainer) => void
  // getTranslations?: () => __WebpackModuleApi.RequireContext
  // getRoutes?: () => PartialRouteObject[]
}

export type AppRegistryServiceHooks = {
  /**
   * Invoked when an app is registered.
   */
  appRegistered: AsyncParallelHook<IApp>
}

export class AppRegistryService extends BaseService {
  public hooks: AppRegistryServiceHooks = {
    appRegistered: new AsyncParallelHook(),
  }

  private _apps: Record<string, IApp> = {}

  /**
   * Register an app.
   */
  public async register(app: IApp): Promise<AppRegistryService> {
    const id = app.getId()
    if (id in this._apps) {
      return this
    }

    app.onRegister?.(this.parentContainer)

    // if (app.getTranslations) {
    //   addTranslations(app.getTranslations())
    // }

    this._apps[id] = app
    await this.hooks.appRegistered.invokeAsync(app)
    return this
  }

  /**
   * Get a record of current registered apps.
   */
  public get apps(): Readonly<Record<string, IApp>> {
    return this._apps
  }
}
