import React from 'react'
import { IApp, ServicesContainer } from '@tidb-dashboard/core'
import OverviewPage from './pages/Overview'

export class App implements IApp {
  getId(): string {
    return 'built_in.app.overview'
  }

  onRegister(c: ServicesContainer) {
    c.Routing.addRoutes(this, [
      {
        path: '/',
        element: <OverviewPage />,
      },
    ])
  }
}
