import webpack from 'webpack'
import * as webpackUtils from '@tidb-dashboard/build-scripts/webpack/utils'

export default function config(): webpack.Configuration {
  return webpackUtils.buildStandardAppConfig(__filename)
}
