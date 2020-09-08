import webpack from 'webpack'
import { merge } from 'webpack-merge'
import ManifestPlugin from 'webpack-manifest-plugin'
import * as webpackUtils from '@tidb-dashboard/build-scripts/webpack/utils'

import librariesAlias from './libraries-alias.json'
import libraries from './libraries.json'

export default function (env: webpackUtils.WebpackEnv): webpack.Configuration {
  return merge(webpackUtils.buildCommonConfig(env, __filename), {
    resolve: {
      alias: {
        ...librariesAlias,
      },
    },
    entry: Object.fromEntries(libraries.map((p) => [p, p])),
    output: {
      filename: '[name].js',
      libraryTarget: 'amd',
      libraryExport: 'default',
    },
    plugins: [
      new ManifestPlugin({
        fileName: 'manifest.shared-libraries.json',
      }),
    ],
  })
}
