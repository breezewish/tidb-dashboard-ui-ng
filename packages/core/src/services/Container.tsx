import { ApiClient } from '@core/services/ApiClient'
import { AppRegistry } from '@core/services/AppRegistry'
import { I18N } from '@core/services/I18N'
import { LayoutRegistry } from '@core/services/LayoutRegistry'
import { MenuRegistry } from '@core/services/MenuRegistry'
import { Routing } from '@core/services/Routing'
import { Settings } from '@core/services/Settings'

export class ServicesContainer {
  public I18N: I18N
  public Routing: Routing
  public AppRegistry: AppRegistry
  public ApiClient: ApiClient
  public Settings: Settings
  public MenuRegistry: MenuRegistry
  public LayoutRegistry: LayoutRegistry

  public constructor() {
    this.I18N = new I18N(this)
    this.Routing = new Routing(this)
    this.AppRegistry = new AppRegistry(this)
    this.ApiClient = new ApiClient(this)
    this.Settings = new Settings(this)
    this.MenuRegistry = new MenuRegistry(this)
    this.LayoutRegistry = new LayoutRegistry(this)
  }
}
