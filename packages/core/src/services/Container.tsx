import React, { useContext } from 'react'
import { I18nextProvider } from 'react-i18next'
import { ApiClientService } from '@core/services/ApiClient'
import { AppRegistryService } from '@core/services/AppRegistry'
import { I18NService } from '@core/services/I18N'
import { RoutingService } from '@core/services/Routing'

export class ServicesContainer {
  public static DefaultServicesContainer: ServicesContainer
  public static Provider: (props: IProviderProps) => JSX.Element

  public I18N: I18NService
  public Routing: RoutingService
  public AppRegistry: AppRegistryService
  public ApiClient: ApiClientService

  public constructor() {
    this.I18N = new I18NService(this)
    this.Routing = new RoutingService(this)
    this.AppRegistry = new AppRegistryService(this)
    this.ApiClient = new ApiClientService(this)
  }
}

const Context = React.createContext(ServicesContainer.DefaultServicesContainer)

export interface IProviderProps {
  container: ServicesContainer
  children?: React.ReactNode
}

function Provider({ container, children }: IProviderProps): JSX.Element {
  return (
    <Context.Provider value={container}>
      <I18nextProvider i18n={container.I18N.i18nextInstance}>
        {children}
      </I18nextProvider>
    </Context.Provider>
  )
}

ServicesContainer.Provider = Provider

ServicesContainer.DefaultServicesContainer = new ServicesContainer()

/**
 * Get current services container from the context.
 */
export function useServices(): ServicesContainer {
  return useContext(Context)
}
