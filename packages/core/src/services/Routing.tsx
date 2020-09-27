import { Location } from 'history'
import React from 'react'
import { PartialRouteObject } from 'react-router'
import type { IApp } from '@core/services/AppRegistry'
import { BaseService } from '@core/services/Base'
import { AsyncSeriesBailHook, AsyncParallelHook } from '@core/tap'

export interface Route extends PartialRouteObject {
  skipAuthentication?: boolean
  sourceApp?: IApp
  children?: Route[]
}

export interface IRouteAuthenticateHookArg {
  location: Location
  route: Route
}

export interface IRouteAuthenticateHookRet {
  failAction: {
    /**
     * Performs a redirection.
     *
     * When this is set, `component` will be ignored.
     */
    redirectTo?: string

    /**
     * Whether the redirection should replace current location.
     */
    redirectReplace?: boolean

    /**
     * Display a component instead of the route content.
     */
    component?: React.ReactNode
  }
}

export type RoutingServiceHooks = {
  /**
   * Invoked when route is just loaded and trying to authenticate. Listeners
   * should return a value to indicate authentication failure, or return
   * `undefined` to indicate authentication pass.
   */
  routeAuthenticate: AsyncSeriesBailHook<
    IRouteAuthenticateHookArg,
    IRouteAuthenticateHookRet
  >

  /**
   * Invoked when route is changed.
   */
  routeChanged: AsyncParallelHook<void>
}

function routeWithApp(sourceApp: IApp, route: Route): Route {
  let children
  if (route.children) {
    children = route.children.map((r) => routeWithApp(sourceApp, r))
  }
  return {
    ...route,
    sourceApp,
    children,
  }
}

export class Routing extends BaseService {
  public hooks: RoutingServiceHooks = {
    routeAuthenticate: new AsyncSeriesBailHook(),
    routeChanged: new AsyncParallelHook(),
  }

  private _routes: Record<string, Route[]> = {}

  public addRoutesWithLayout(
    sourceApp: IApp,
    layout: string,
    routes: Route[]
  ): Routing {
    if (layout !== '') {
      // Ensure layout exists
      this.parentContainer.LayoutRegistry.get(layout)
    }
    if (!(layout in this._routes)) {
      this._routes[layout] = []
    }
    this._routes[layout] = [
      ...this._routes[layout],
      ...routes.map((r) => {
        console.debug('%s: Adding route %s', sourceApp.getId(), r.path)
        return routeWithApp(sourceApp, r)
      }),
    ]
    this.hooks.routeChanged.invokeAsync()
    return this
  }

  public addRoutes(sourceApp: IApp, routes: Route[]): Routing {
    return this.addRoutesWithLayout(sourceApp, '', routes)
  }

  public getRoutesByLayout(): Readonly<Record<string, Route[]>> {
    return this._routes
  }
}
