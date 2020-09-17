import path from 'path'
import webpack from 'webpack'
import { merge } from 'webpack-merge'
import nodeExternals from 'webpack-node-externals'
import * as webpackUtils from '@tidb-dashboard/build-scripts/webpack/utils'

export default function config(): webpack.Configuration {
  return merge(
    webpackUtils.buildCommonConfig(__filename),
    // webpackUtils.buildFSCacheConfig(__filename),
    webpackUtils.buildWatchConfig(),
    {
      entry: {
        api: './src',
      },
      output: {
        libraryTarget: 'commonjs2',
      },
      target: 'node',
      externals: [
        nodeExternals(),
        nodeExternals({
          modulesDir: path.resolve(__dirname, '../../node_modules'),
        }),
      ],
    }
  )
}
