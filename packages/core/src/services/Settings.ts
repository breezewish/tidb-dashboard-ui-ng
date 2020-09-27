import { BaseService } from '@core/services/Base'
import type { ServicesContainer } from '@core/services/Container'

const KEY = 'tidb_dashboard.settings'

export class Settings extends BaseService {
  private _settings: Record<string, any> = {}

  public constructor(container: ServicesContainer) {
    super(container)
    this.loadSettings()
  }

  private loadSettings() {
    const s = localStorage.getItem(KEY)
    if (s === null) {
      return
    }
    const opt = JSON.parse(s)
    if (opt && typeof opt === 'object' && opt.constructor === Object) {
      this._settings = opt
    }
  }

  private storeSettings() {
    localStorage.setItem(KEY, JSON.stringify(this._settings))
  }

  /**
   * Update settings and persist in browser session.
   */
  public updateSettings(settings: Record<string, any>, replace = false) {
    // Ensure serialized data is the same as the one in memory.
    const settingsRaw = JSON.parse(JSON.stringify(settings))
    if (replace) {
      this._settings = settingsRaw
    } else {
      this._settings = { ...this._settings, ...settingsRaw }
    }
    this.storeSettings()
  }

  /**
   * Get current browser session settings.
   */
  public get settings(): Readonly<Record<string, any>> {
    return this._settings
  }
}
