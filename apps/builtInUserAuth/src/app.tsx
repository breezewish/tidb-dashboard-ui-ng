import React from 'react'
import {
  IApp,
  ServicesContainer,
  useScopedTranslationFactory,
} from '@tidb-dashboard/core'
import SignInPage from './pages/SignIn'
import * as auth from './utils/auth'

const ID = 'built_in.user_auth'

// eslint-disable-next-line
export const useScopedTranslation = useScopedTranslationFactory(ID)

export class App implements IApp {
  getId(): string {
    return ID
  }

  onRegister(c: ServicesContainer) {
    c.ApiClient.hooks.resolveApiKey.tapAsync(async () => {
      const bearer = auth.getAuthTokenAsBearer()
      if (bearer) {
        return bearer
      }
    })
    c.Routing.addRoutes(this, [
      {
        path: '/sign_in',
        element: <SignInPage />,
        metadata: {
          skipAuthentication: true,
        },
      },
    ])
    c.Routing.hooks.routeAuthenticate.tapAsync(async () => {
      return {
        failAction: {
          redirectTo: '/sign_in',
          redirectReplace: true,
        },
      }
    })
    c.I18N.addScopedTranslationsBundle(
      this,
      require.context('../translations/', false, /\.yaml$/)
    )
    c.I18N.addGlobalTranslationsBundle(
      require.context('../translationsGlobal/', false, /\.yaml$/)
    )
  }
}
