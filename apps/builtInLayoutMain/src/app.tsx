import React from 'react'
import { IApp, ServicesContainer } from '@tidb-dashboard/core'
import Layout from './Layout'
import { ID } from './meta'

export class App implements IApp {
  getId(): string {
    return ID
  }

  onRegister(c: ServicesContainer) {
    c.LayoutRegistry.add('main', <Layout />)
  }
}
