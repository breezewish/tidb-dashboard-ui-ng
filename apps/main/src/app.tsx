import { useMount } from 'ahooks'
import { Alert } from 'antd'
import React, { useMemo } from 'react'
import { useEffect, useState } from 'react'
import { PartialRouteObject } from 'react-router'
import { useRoutes } from 'react-router-dom'
import { HashRouter } from 'react-router-dom'
import { useServices, ServicesContainer, Services } from '@tidb-dashboard/core'
import { PrivateRoute, PublicRoute } from './Route'

function buildRouteObject(route: Services.Route): PartialRouteObject {
  let newChildren
  if (route.children) {
    newChildren = route.children.map((r) => buildRouteObject(r))
  }

  let newRouteElement: React.ReactNode = (
    <Alert.ErrorBoundary>{route.element}</Alert.ErrorBoundary>
  )
  if (route.skipAuthentication) {
    newRouteElement = <PublicRoute route={route}>{newRouteElement}</PublicRoute>
  } else {
    newRouteElement = (
      <PrivateRoute route={route}>{newRouteElement}</PrivateRoute>
    )
  }

  return {
    ...route,
    element: newRouteElement,
    children: newChildren,
  }
}

function Router() {
  const services = useServices()
  const [routesByLayout, setRoutesByLayout] = useState<
    Record<string, Services.Route[]>
  >(services.Routing.getRoutesByLayout())

  useEffect(() => {
    const handleRouteChanged = async () => {
      setRoutesByLayout(services.Routing.getRoutesByLayout())
    }
    return services.Routing.hooks.routeChanged.tapAsync(handleRouteChanged)
  }, [services])

  const routes = useMemo(() => {
    const r: PartialRouteObject[] = []
    for (const [layoutName, routes] of Object.entries(routesByLayout)) {
      if (layoutName === '') {
        // No layout, append it directly
        for (const route of routes) {
          r.push(buildRouteObject(route))
        }
      } else {
        const layout = services.LayoutRegistry.get(layoutName)
        const children = routes.map((r) => buildRouteObject(r))
        r.push({
          element: layout,
          children,
        })
      }
    }
    return r
  }, [routesByLayout, services])

  return useRoutes(routes)
}

export interface IAppProps {
  container: ServicesContainer
}

export function App({ container }: IAppProps) {
  useMount(() => {
    const spinner = document.getElementById('dashboard_page_spinner')
    if (spinner) {
      spinner.remove()
    }
  })

  return (
    <Services.ContainerProvider container={container}>
      <HashRouter>
        <Alert.ErrorBoundary>
          <Router />
        </Alert.ErrorBoundary>
      </HashRouter>
    </Services.ContainerProvider>
  )
}
