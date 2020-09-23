import { ConfigProvider } from 'antd'
import enUS from 'antd/es/locale/en_US'
import React, { useContext } from 'react'
import { ServicesContainer } from '@core/services/Container'

const Context = React.createContext<ServicesContainer | null>(null)

export interface IContainerProviderProps {
  container: ServicesContainer
  children?: React.ReactNode
}

export function ContainerProvider({
  container,
  children,
}: IContainerProviderProps): JSX.Element {
  return (
    <Context.Provider value={container}>
      <ConfigProvider locale={enUS}>{children}</ConfigProvider>
    </Context.Provider>
  )
}

/**
 * Get current services container from the context.
 */
export function useServices(): ServicesContainer {
  const container = useContext(Context)
  if (container === null) {
    throw new Error('<ServicesContainer> is required in the render tree')
  }
  return container
}
