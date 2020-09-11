import { useMount } from 'ahooks'
import { Alert } from 'antd'
import React from 'react'
import { useEffect, useState } from 'react'
import { PartialRouteObject } from 'react-router'
import { useRoutes } from 'react-router-dom'
import { HashRouter } from 'react-router-dom'
import { useServices, ServicesContainer } from '@tidb-dashboard/core'

function Router() {
  const [routes, setRoutes] = useState<PartialRouteObject[]>([])
  const services = useServices()

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
    <ServicesContainer.Context.Provider value={container}>
      <HashRouter>
        <Alert.ErrorBoundary>
          <Router />
        </Alert.ErrorBoundary>
      </HashRouter>
    </ServicesContainer.Context.Provider>
  )
}
