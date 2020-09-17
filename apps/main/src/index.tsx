import { Modal } from 'antd'
import NProgress from 'nprogress'
import React from 'react'
import ReactDOM from 'react-dom'
import format from 'string-template'
import { ServicesContainer, SystemJs, IApp } from '@tidb-dashboard/core'
import { App } from './app'
import './nprogress.less'

async function main() {
  NProgress.configure({
    showSpinner: false,
  })
  await loadApps(ServicesContainer.DefaultServicesContainer)
}

async function loadApps(container: ServicesContainer) {
  const mockAppsList = ['builtInUserAuth', 'builtInOverview']
  const mockAppLoadPattern = '/dashboard/static/apps/{appPath}/build/index.js'

  for (const appPathSegment of mockAppsList) {
    const url = format(mockAppLoadPattern, { appPath: appPathSegment })
    console.debug('%s: Loading from %s', appPathSegment, url)
    const appModule = await SystemJs.import(url)
    if (!('App' in appModule)) {
      console.warn(
        '%s: Field `App` not found from loaded module, skipped',
        appPathSegment
      )
      continue
    }
    if (
      !('getId' in appModule.App) ||
      typeof appModule.App['getId'] !== 'function'
    ) {
      console.warn(
        '%s: Field `App` does not seem to implement IApp interface, skipped',
        appPathSegment
      )
      continue
    }
    const app = appModule.App as IApp
    const appId = app.getId()
    console.debug('%s: App loaded', appId)
    try {
      await container.AppRegistry.register(app)
    } catch (e) {
      throw new Error(`Load app ${appId} failed: ${e.message}`)
    }
    console.debug('%s: App registered', appId)
  }

  ReactDOM.render(
    <App container={container} />,
    document.getElementById('root')
  )
}

main().catch((e) => {
  Modal.error({
    title: 'Initialize TiDB Dashboard failed',
    content: e.stack,
    okText: 'Reload Page',
    onOk: () => window.location.reload(),
  })
})
