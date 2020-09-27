import { BaseService } from '@core/services/Base'

export class LayoutRegistry extends BaseService {
  private _layouts: Record<string, React.ReactNode> = {}

  public add(id: string, layout: React.ReactNode) {
    this._layouts[id] = layout
  }

  public get(id: string): React.ReactNode {
    if (!(id in this._layouts)) {
      throw new Error(`Layout '${id}' not found`)
    }
    return this._layouts[id]
  }
}
