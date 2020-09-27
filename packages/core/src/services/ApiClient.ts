import { BaseService } from '@core/services/Base'
import type { ServicesContainer } from '@core/services/Container'
import { AsyncSeriesBailHook } from '@core/tap'
import { DefaultApi } from '@tidb-dashboard/api'

export type ApiClientServiceHooks = {
  /**
   * Invoked to resolve an API key. API key resolvers can tap this hook to
   * provide a resolution.
   */
  resolveApiKey: AsyncSeriesBailHook<void, string>
}

export class ApiClient extends BaseService {
  public hooks: ApiClientServiceHooks = {
    resolveApiKey: new AsyncSeriesBailHook(),
  }

  private _default: DefaultApi

  public constructor(container: ServicesContainer) {
    super(container)

    let apiPrefix
    if (process.env.NODE_ENV === 'development') {
      if (process.env.REACT_APP_DASHBOARD_API_URL) {
        apiPrefix = `${process.env.REACT_APP_DASHBOARD_API_URL}/dashboard`
      } else {
        apiPrefix = 'http://127.0.0.1:12333/dashboard'
      }
    } else {
      apiPrefix = '/dashboard'
      // apiPrefix = publicPathPrefix
    }
    const apiUrl = `${apiPrefix}/api`

    // TODO: Init Axios client
    this._default = new DefaultApi({
      apiKey: async () => {
        const r = await this.hooks.resolveApiKey.invokeAsync()
        return r || ''
      },
      basePath: apiUrl,
    })
  }

  public get default(): DefaultApi {
    return this._default
  }
}
