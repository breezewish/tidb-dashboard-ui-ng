import webpack from 'webpack'
import * as webpackUtils from '@tidb-dashboard/build-scripts/webpack/utils'

export default function config(
  env: webpackUtils.WebpackEnv
): webpack.Configuration {
  return webpackUtils.buildStandardAppConfig(env, __filename)
}
