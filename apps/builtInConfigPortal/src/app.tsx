/**
 * Config Portal allows to update settings by receiving messages posted to a portal page.
 */

import React from 'react'
import { IApp, ServicesContainer } from '@tidb-dashboard/core'
import ConfigPortalPage from './pages/ConfigPortal'

export class App implements IApp {
  getId(): string {
    return 'built_in.app.config_portal'
  }

  onRegister(c: ServicesContainer) {
    c.Routing.addRoutes(this, [
      {
        path: '/portal',
        element: <ConfigPortalPage />,
        metadata: {
          skipAuthentication: true,
        },
      },
    ])
  }
}
