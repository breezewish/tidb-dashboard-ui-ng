import React from 'react'
import { IApp, ServicesContainer } from '@tidb-dashboard/core'
// import SignInPage from './pages/SignIn'

export class App implements IApp {
  getId(): string {
    return 'built_in.overview'
  }

  onRegister(c: ServicesContainer) {
    c.Routing.addRoutes(this, [
      {
        path: '/',
        element: <div>Overview</div>,
      },
    ])
  }
}
