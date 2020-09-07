import webpack from 'webpack'
import { merge } from 'webpack-merge'
import ManifestPlugin from 'webpack-manifest-plugin'
import * as webpackUtils from '@tidb-dashboard/build-scripts/webpack/utils'

import librariesAlias from './src/libraries-alias.json'
import libraries from './src/libraries.json'

export default function (env: webpackUtils.WebpackEnv): webpack.Configuration {
  return merge(webpackUtils.buildCommonConfig(env, __filename), {
    resolve: {
      alias: {
        ...librariesAlias,
      },
    },
    output: {
      filename: 'libs.js',
      libraryTarget: 'system',
    },
    plugins: [
      new webpack.container.ModuleFederationPlugin({
        shared: libraries,
      }),
      new ManifestPlugin({
        fileName: 'manifest.shared-libraries.json',
      }),
    ],
    cache:
      env === 'production'
        ? false
        : webpackUtils.getFileSystemCacheConfig(__filename),
  })
}
