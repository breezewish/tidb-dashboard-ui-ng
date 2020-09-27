import { DashboardOutlined } from '@ant-design/icons'
import React from 'react'
import { Services } from '@tidb-dashboard/core'
import { IApp, ServicesContainer } from '@tidb-dashboard/core'
import OverviewPage from './pages/Overview'

export class App implements IApp {
  getId(): string {
    return 'built_in.app.overview'
  }

  onRegister(c: ServicesContainer) {
    c.Routing.addRoutesWithLayout(this, 'main', [
      {
        path: '/',
        element: <OverviewPage />,
      },
    ])

    const { SYSTEM_MENUS } = Services.MenuRegistry

    c.MenuRegistry.menus[SYSTEM_MENUS.ID_MAIN].appendItem({
      path: [SYSTEM_MENUS.PATH_MAIN_BASIC, 'system_overview'],
      icon: <DashboardOutlined />,
      type: 'item',
      to: '/',
    })
  }
}
