import { Alert } from 'antd'
import React, { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Services, useServices } from '@tidb-dashboard/core'

enum RouteState {
  Authenticating = 'Authenticating',
  Authenticated = 'Authenticated',
  NotAuthenticated = 'NotAuthenticated',
}

export interface IPrivateOrPublicRouteProps {
  children?: React.ReactNode
  route: Services.Route
}

export function PublicRoute({
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

export function PrivateRoute({
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
