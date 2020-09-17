import path from 'path'
import express from 'express'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import * as webpackUtils from '@tidb-dashboard/build-scripts/webpack/utils'

const publicPath = '/dashboard/'

export default function devServerConfig(): webpack.Configuration {
  if (webpackUtils.NODE_ENV === 'production') {
    return {}
  }
  const devServer: WebpackDevServer.Configuration = {
    publicPath,
    contentBase: path.join(__dirname, 'public'),
    contentBasePublicPath: publicPath,
    watchContentBase: true,
    compress: true,
    port: 3001,
    clientLogLevel: 'none',
    overlay: true,
    open: true,
    before: (app, _server, compiler) => {
      const router = express.Router()
      router.use(
        '/static/apps',
        express.static(path.join(webpackUtils.ROOT_DIR, 'apps'))
      )

      app.use(publicPath, router)
      app.get('/', (_req, res) => res.redirect(publicPath))
    },
  }
  return { devServer, stats: { preset: 'minimal' } } as any
}
