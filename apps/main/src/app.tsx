import { PartialRouteObject } from 'react-router'
import { useRoutes } from 'react-router-dom'
import { Registry } from '@tidb-dashboard/core'
import { useEffect, useState } from 'react'

export interface IAppRegistryRootProps {
  registry: any //Registry.AppRegistry
}

export function App({ registry }: IAppRegistryRootProps) {
  const [routes, setRoutes] = useState<PartialRouteObject[]>([])

  useEffect(() => {
    const handleAppChange = () => {
      setRoutes(registry.getRoutes())
    }
    registry.on('appChanged', handleAppChange)
    return () => {
      registry.off('appChanged', handleAppChange)
    }
  }, [registry])

  const element = useRoutes(routes)
  return element
}
