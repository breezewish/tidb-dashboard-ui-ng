import { ApiClientService } from '@core/services/ApiClient'
import { AppRegistryService } from '@core/services/AppRegistry'
import { I18NService } from '@core/services/I18N'
import { RoutingService } from '@core/services/Routing'
import { SettingsService } from '@core/services/Settings'

export class ServicesContainer {
  public I18N: I18NService
  public Routing: RoutingService
  public AppRegistry: AppRegistryService
  public ApiClient: ApiClientService
  public Settings: SettingsService

  public constructor() {
    this.I18N = new I18NService(this)
    this.Routing = new RoutingService(this)
    this.AppRegistry = new AppRegistryService(this)
    this.ApiClient = new ApiClientService(this)
    this.Settings = new SettingsService(this)
  }
}
