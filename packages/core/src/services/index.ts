import { useContext } from 'react'
import { ServicesContainer } from '@core/services/Container'

export * from '@core/services/Container'
export * from '@core/services/AppRegistry'
export * from '@core/services/Routing'

export class BaseService {
  /**
   * The service container this service belongs.
   */
  protected parentContainer: ServicesContainer

  constructor(container: ServicesContainer) {
    this.parentContainer = container
  }
}

/**
 * Get current services container from the context.
 */
export function useServices(): ServicesContainer {
  return useContext(ServicesContainer.Context)
}
