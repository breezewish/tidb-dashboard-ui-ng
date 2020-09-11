import { Modal } from 'antd'
import NProgress from 'nprogress'
import React from 'react'
import ReactDOM from 'react-dom'
import { ServicesContainer } from '@tidb-dashboard/core'
import { App } from './app'
import './nprogress.less'

async function main() {
  NProgress.configure({
    showSpinner: false,
  })

  ReactDOM.render(
    <App container={ServicesContainer.DefaultServicesContainer} />,
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
