import React from 'react'
import { IApp, Services, ServicesContainer } from '@tidb-dashboard/core'
import { ID } from './meta'
import SignInPage from './pages/SignIn'
import * as auth from './utils/auth'

export class App implements IApp {
  getId(): string {
    return ID
  }

  async resolveApiKey(): Promise<string | void> {
    const bearer = auth.getAuthTokenAsBearer()
    if (bearer) {
      return bearer
    }
  }

  async handleRouteAuthenticate(): Promise<Services.IRouteAuthenticateHookRet | void> {
    if (!auth.getAuthTokenAsBearer()) {
      return {
        failAction: {
          redirectTo: '/sign_in',
          redirectReplace: true,
        },
      }
    }
  }

  onRegister(c: ServicesContainer) {
    c.ApiClient.hooks.resolveApiKey.tapAsync(this.resolveApiKey.bind(this))
    c.Routing.hooks.routeAuthenticate.tapAsync(
      this.handleRouteAuthenticate.bind(this)
    )
    c.Routing.addRoutes(this, [
      {
        path: '/sign_in',
        element: <SignInPage />,
        metadata: {
          skipAuthentication: true,
        },
      },
    ])
    Services.I18NService.addScopedTranslationsBundle(
      ID,
      require.context('../translations/', false, /\.yaml$/)
    )
    Services.I18NService.addGlobalTranslationsBundle(
      require.context('../translationsGlobal/', false, /\.yaml$/)
    )
  }
}
