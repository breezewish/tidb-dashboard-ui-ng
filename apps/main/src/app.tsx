import { useMount } from 'ahooks'
import { Alert } from 'antd'
import React from 'react'
import { useEffect, useState } from 'react'
import { PartialRouteObject } from 'react-router'
import { useRoutes } from 'react-router-dom'
import { HashRouter } from 'react-router-dom'
import { useServices, ServicesContainer } from '@tidb-dashboard/core'

function Router() {
  const services = useServices()
  const [routes, setRoutes] = useState<PartialRouteObject[]>(
    services.Routing.getRoutes()
  )

  useEffect(() => {
    const handleRouteChanged = async () => {
      setRoutes(services.Routing.getRoutes())
    }
    return services.Routing.hooks.routeChanged.tapAsync(handleRouteChanged)
  }, [services])

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
    <ServicesContainer.Provider container={container}>
      <HashRouter>
        <Alert.ErrorBoundary>
          <Router />
        </Alert.ErrorBoundary>
      </HashRouter>
    </ServicesContainer.Provider>
  )
}
