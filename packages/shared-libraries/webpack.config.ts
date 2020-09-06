import webpack from 'webpack'
import { merge } from 'webpack-merge'
import generate from 'generate-file-webpack-plugin'
import ManifestPlugin from 'webpack-manifest-plugin'
import * as webpackUtils from '@tidb-dashboard/build-scripts/webpack/utils'

import librariesAlias from './src/libraries-alias.json'
import libraries from './src/libraries.json'

export default function (env: webpackUtils.WebpackEnv): webpack.Configuration {
  return merge(webpackUtils.buildCommonConfig(env, __filename), {
    entry: {
      main: './index',
    },
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
      generate({
        file: 'libraries.json',
        content: JSON.stringify(libraries, null, 2),
      }),
      generate({
        file: 'library-aliases.json',
        content: JSON.stringify(librariesAlias, null, 2),
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
