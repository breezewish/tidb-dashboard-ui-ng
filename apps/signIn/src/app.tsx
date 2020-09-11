import React from 'react'
import { PartialRouteObject } from 'react-router'
import { IApp } from '@tidb-dashboard/core'
import SignInPage from './pages/SignIn'

export class AppSignIn implements IApp {
  getId(): string {
    return 'builtIn.signIn'
  }

  getRoutes(): PartialRouteObject[] {
    return [
      {
        path: '/sign_in',
        element: <SignInPage />,
      },
    ]
  }
}
