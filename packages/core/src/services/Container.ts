import React from 'react'
import { AppRegistryService } from '@core/services/AppRegistry'
import { RoutingService } from '@core/services/Routing'
import { SyncSeriesHook } from '@core/tap'

export type ServicesContainerHooks = {
  /**
   * Invoked when container is just constructed. At the time all services
   * are ensured to be initialized.
   */
  containerConstructed: SyncSeriesHook<void>
}

export class ServicesContainer {
  public static DefaultServicesContainer = new ServicesContainer()
  public static Context = React.createContext(
    ServicesContainer.DefaultServicesContainer
  )

  public Routing: RoutingService
  public AppRegistry: AppRegistryService
  public hooks: ServicesContainerHooks

  public constructor() {
    this.hooks = {
      containerConstructed: new SyncSeriesHook(),
    }
    this.Routing = new RoutingService(this)
    this.AppRegistry = new AppRegistryService(this)
    this.hooks.containerConstructed.invokeSync()
  }
}
