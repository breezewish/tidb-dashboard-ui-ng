import React from 'react'
import { PartialRouteObject } from 'react-router'
import { EventEmitter2 } from 'eventemitter2'
import { addTranslations } from './i18n'
import _ from 'lodash'

export interface IApp {
  id: string
  component: React.ReactNode
  path: string
  translations?: __WebpackModuleApi.RequireContext
}

export class AppRegistry extends EventEmitter2 {
  private apps: Record<string, IApp> = {}
  private routeCache: PartialRouteObject[] | null = null

  register(app: IApp): AppRegistry {
    if (app.id in this.apps) {
      return this
    }
    this.routeCache = null

    if (app.translations) {
      addTranslations(app.translations)
    }
    this.apps[app.id] = app
    this.emit('appChanged')

    return this
  }

  unregister(id: string): AppRegistry {
    throw new Error('Unimplemented')
    return this
  }

  getRoutes(): PartialRouteObject[] {
    if (!this.routeCache) {
      this.routeCache = _.map(this.apps, (app) => {
        return {
          path: app.path,
          element: app.component,
        }
      })
    }
    return this.routeCache
  }
}

export const DefaultAppRegistry = new AppRegistry()
