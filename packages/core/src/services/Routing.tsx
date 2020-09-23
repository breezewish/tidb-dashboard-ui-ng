import { Alert } from 'antd'
import { Location } from 'history'
import React, { useState, useEffect } from 'react'
import { PartialRouteObject } from 'react-router'
import { useLocation } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import type { IApp } from '@core/services/AppRegistry'
import { BaseService } from '@core/services/Base'
import { useServices } from '@core/services/ContainerContext'
import { AsyncSeriesBailHook, AsyncParallelHook } from '@core/tap'

export interface RouteMetadata extends Record<string, any> {
  skipAuthentication?: boolean
}

export interface Route extends PartialRouteObject {
  metadata?: RouteMetadata
  sourceApp?: IApp
}

enum RouteState {
  Authenticating = 'Authenticating',
  Authenticated = 'Authenticated',
  NotAuthenticated = 'NotAuthenticated',
}

interface IPrivateOrPublicRouteProps {
  children?: React.ReactNode
  route: Route
}

function PublicRoute({
  children,
  route,
}: IPrivateOrPublicRouteProps): JSX.Element {
  const location = useLocation()
  console.debug(
    '%s: Render public route: %s',
    route.sourceApp?.getId(),
    location.pathname
  )
  return <>{children}</>
}

function PrivateRoute({
  children,
  route,
}: IPrivateOrPublicRouteProps): JSX.Element {
  const [state, setState] = useState(RouteState.Authenticating)
  const [failureElement, setFailureElement] = useState<
    React.ReactNode | undefined
  >(undefined)
  const { Routing } = useServices()
  const location = useLocation()

  console.debug(
    '%s: Render private route [%s]: %s',
    route.sourceApp?.getId(),
    state,
    location.pathname
  )

  useEffect(() => {
    // Result will be discarded when location is changed.
    let cancel = false

    async function auth() {
      try {
        // Reset state, since there may be simply a location change in the same route.
        setState(RouteState.Authenticating)
        setFailureElement(undefined)

        const r = await Routing.hooks.routeAuthenticate.invokeAsync({
          location,
          route,
        })
        if (cancel) {
          return
        }

        if (!r) {
          setState(RouteState.Authenticated)
          return
        }

        setState(RouteState.NotAuthenticated)
        if (r.failAction.redirectTo !== undefined) {
          setFailureElement(<Navigate to={r.failAction.redirectTo} />)
        } else {
          setFailureElement(r.failAction.component)
        }
      } catch (e) {
        if (cancel) {
          return
        }

        setState(RouteState.NotAuthenticated)
        setFailureElement(
          <Alert type="error" message="Error" description={e.message} />
        )
      }
    }
    auth()

    return () => {
      cancel = true
    }
  }, [Routing, route, location])

  switch (state) {
    case RouteState.Authenticating:
      return <>{null}</>
    case RouteState.Authenticated:
      return <>{children}</>
    case RouteState.NotAuthenticated:
      return <>{failureElement}</>
    default:
      return <>{null}</>
  }
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

export class RoutingService extends BaseService {
  public hooks: RoutingServiceHooks = {
    routeAuthenticate: new AsyncSeriesBailHook(),
    routeChanged: new AsyncParallelHook(),
  }

  private routes: Route[] = []

  public addRoutes(sourceApp: IApp, routes: Route[]): RoutingService {
    this.routes = [
      ...this.routes,
      ...routes.map((r) => {
        console.debug('%s: Adding route %s', sourceApp.getId(), r.path)
        const newRoute: Route = {
          ...r,
          sourceApp,
        }
        newRoute.element = newRoute.metadata?.skipAuthentication ? (
          <PublicRoute route={newRoute}>
            <Alert.ErrorBoundary>{newRoute.element}</Alert.ErrorBoundary>
          </PublicRoute>
        ) : (
          <PrivateRoute route={newRoute}>
            <Alert.ErrorBoundary>{newRoute.element}</Alert.ErrorBoundary>
          </PrivateRoute>
        )
        return newRoute
      }),
    ]
    this.hooks.routeChanged.invokeAsync()
    return this
  }

  public getRoutes(): PartialRouteObject[] {
    return this.routes
  }
}
