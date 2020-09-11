import { Alert } from 'antd'
import { Location } from 'history'
import React, { useState, useEffect } from 'react'
import { PartialRouteObject, useLocation } from 'react-router'
import { Navigate } from 'react-router-dom'
import {
  BaseService,
  ServicesContainer,
  useServices,
  IApp,
} from '@core/services'
import { AsyncSeriesBailHook, AsyncParallelHook } from '@core/tap'

interface IPrivateRouteProps {
  children?: React.ReactNode
}

enum RouteState {
  Authenticating,
  Authenticated,
  NotAuthenticated,
}

export interface IRouteAuthenticateHookArg {
  location: Location
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
     * Display a component instead of the route content.
     */
    component?: React.ReactNode
  }
}

function PrivateRoute({ children }: IPrivateRouteProps): JSX.Element {
  const [state, setState] = useState(RouteState.Authenticating)
  const [failureElement, setFailureElement] = useState<
    React.ReactNode | undefined
  >(undefined)
  const { Routing } = useServices()
  const location = useLocation()

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
  }, [Routing, location])

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

  private routes: PartialRouteObject[] = []

  public constructor(container: ServicesContainer) {
    super(container)
    container.hooks.containerConstructed.tapSyncOnce(() => {
      container.AppRegistry.hooks.appRegistered.tapAsync(
        this.handleAppRegistered.bind(this)
      )
    })
  }

  private async handleAppRegistered(app: IApp) {
    if (app.getRoutes) {
      this.registerAppRoutes(app.getRoutes())
    }
  }

  private async registerAppRoutes(routes: PartialRouteObject[]) {
    this.routes = [
      ...this.routes,
      ...routes.map((r) => {
        return {
          ...r,
          element: (
            <PrivateRoute>
              <Alert.ErrorBoundary>{r.element}</Alert.ErrorBoundary>
            </PrivateRoute>
          ),
        } as PartialRouteObject
      }),
    ]
    this.hooks.routeChanged.invokeAsync()
  }

  public getRoutes(): PartialRouteObject[] {
    return this.routes
  }
}
