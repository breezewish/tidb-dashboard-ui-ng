import type { ServicesContainer } from '@core/services/Container'

export class BaseService {
  /**
   * The service container this service belongs.
   */
  protected parentContainer: ServicesContainer

  constructor(container: ServicesContainer) {
    this.parentContainer = container
  }
}
