import { SystemJs } from '@tidb-dashboard/core'
import { App } from './app'

SystemJs.register([], (_export) => {
  return {
    execute: () => {
      _export({ App: new App() })
    },
  }
})
