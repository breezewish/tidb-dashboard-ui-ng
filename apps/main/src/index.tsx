import React from 'react'
import ReactDOM from 'react-dom'
import { Modal } from 'antd'
import { App } from './app'
import { DefaultAppRegistry } from '@tidb-dashboard/core'
import NProgress from 'nprogress'
import './nprogress.less'

function removeSpinner() {
  const spinner = document.getElementById('dashboard_page_spinner')
  if (spinner) {
    spinner.remove()
  }
}

async function main() {
  removeSpinner()
  NProgress.configure({
    showSpinner: false,
  })

  ReactDOM.render(
    <App registry={DefaultAppRegistry} />,
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
