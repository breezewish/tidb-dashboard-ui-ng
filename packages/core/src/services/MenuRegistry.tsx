import {
  AppstoreOutlined,
  SettingOutlined,
  CompassOutlined,
  ExperimentOutlined,
} from '@ant-design/icons'
import { To } from 'history'
import _ from 'lodash'
import React from 'react'
import { BaseService } from '@core/services/Base'
import type { ServicesContainer } from '@core/services/Container'

export type MenuItemPath = string | string[]

export type IMenuItemType = 'item' | 'expandable_group' | 'text_group'

export interface IMenuBaseProps {
  /**
   * A dot (.) separated string including the keys of all parents and the key
   * of the menu item itself.
   *
   * The path will be used as the unique key to identify this menu item, as
   * well as used as the translation key to render text.
   */
  path: MenuItemPath
}

export interface IMenuLinkProps extends IMenuBaseProps {
  type: 'item'
  to: To
  replace?: boolean
  icon?: React.ReactNode
}

export interface IMenuExpandableGroupProps extends IMenuBaseProps {
  type: 'expandable_group'
  icon?: React.ReactNode
}

export interface IMenuTextGroupProps extends IMenuBaseProps {
  type: 'text_group'
}

export type IMenuItemProps =
  | IMenuLinkProps
  | IMenuExpandableGroupProps
  | IMenuTextGroupProps

export type IStructuralMenuItem = {
  item: IMenuItemProps
  children?: IStructuralMenuItem[]
}

export class Menu {
  private _paths = new Set<string>()
  private _items: IMenuItemProps[] = []

  private _structuralItems: IStructuralMenuItem[] | null = null

  public static stringifyPath(path: MenuItemPath): string {
    if (_.isArray(path)) {
      return path.join('.')
    } else {
      return path
    }
  }

  public static splitPath(path: MenuItemPath): string[] {
    if (_.isArray(path)) {
      return _.flatten(path.map((p) => p.split('.')))
    } else {
      return path.split('.')
    }
  }

  /**
   * Append a menu item at the end.
   */
  public appendItem(item: IMenuItemProps): Menu {
    const pathString = Menu.stringifyPath(item.path)
    if (this._paths.has(pathString)) {
      return this
    }
    this._paths.add(pathString)
    this._items.push(item)
    this._structuralItems = null
    return this
  }

  /**
   * Get all menu items in a nested form.
   */
  public getItems(): Readonly<IStructuralMenuItem[]> {
    if (this._structuralItems === null) {
      // `levelOrderedItems` is like:
      // A
      // B
      // C
      // B.D
      // A.E.F  <-- this item will be ignored since its parent A.E does not exist
      // B.D.G
      const levelOrderedItems = _.sortBy(
        this._items,
        (item) => Menu.splitPath(item.path).length
      )
      const outmostItems: IStructuralMenuItem[] = []
      const pathLookups: Record<string, IStructuralMenuItem> = {}
      levelOrderedItems.forEach((userItem) => {
        const item: IStructuralMenuItem = { item: userItem }

        const paths = Menu.splitPath(item.item.path)
        const parentPaths = paths.slice(0, paths.length - 1)
        if (parentPaths.length > 0) {
          const parentItem = pathLookups[parentPaths.join('.')]
          if (!parentItem) {
            console.warn(
              'Menu item %s is ignored since its parent does not exist',
              item.item.path
            )
            return
          }
          parentItem.children!.push(item)
        } else {
          outmostItems.push(item)
        }

        if (
          item.item.type === 'expandable_group' ||
          item.item.type === 'text_group'
        ) {
          item.children = []
          pathLookups[Menu.stringifyPath(item.item.path)] = item
        }
      })
      this._structuralItems = outmostItems
    }
    return this._structuralItems
  }
}

export class MenuRegistry extends BaseService {
  public menus: Record<string, Menu> = {}

  /**
   * Built-in menu IDs and menu item paths.
   */
  public static SYSTEM_MENUS = {
    ID_MAIN: 'system_main',
    PATH_MAIN_BASIC: 'basic',
    PATH_MAIN_MANAGE: 'manage',
    PATH_MAIN_DIAGNOSE: 'diagnose',
    PATH_MAIN_EXPERIMENTAL: 'experimental',
    ID_EXTRA: 'system_extra',
  }

  /**
   * Get or create a menu.
   */
  public ensureMenu(id: string): Menu {
    if (!this.menus[id]) {
      this.menus[id] = new Menu()
    }
    return this.menus[id]
  }

  public constructor(container: ServicesContainer) {
    super(container)
    this.ensureMenu(MenuRegistry.SYSTEM_MENUS.ID_MAIN)
      .appendItem({
        path: MenuRegistry.SYSTEM_MENUS.PATH_MAIN_BASIC,
        icon: <AppstoreOutlined />,
        type: 'expandable_group',
      })
      .appendItem({
        path: MenuRegistry.SYSTEM_MENUS.PATH_MAIN_MANAGE,
        icon: <SettingOutlined />,
        type: 'expandable_group',
      })
      .appendItem({
        path: MenuRegistry.SYSTEM_MENUS.PATH_MAIN_DIAGNOSE,
        icon: <CompassOutlined />,
        type: 'expandable_group',
      })
      .appendItem({
        path: MenuRegistry.SYSTEM_MENUS.PATH_MAIN_EXPERIMENTAL,
        icon: <ExperimentOutlined />,
        type: 'expandable_group',
      })
    this.ensureMenu(MenuRegistry.SYSTEM_MENUS.ID_EXTRA)
  }
}
