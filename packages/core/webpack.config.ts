import webpack from 'webpack'
import { merge } from 'webpack-merge'
import ManifestPlugin from 'webpack-manifest-plugin'
import * as webpackUtils from '@tidb-dashboard/build-scripts/webpack/utils'

export default function (env: webpackUtils.WebpackEnv): webpack.Configuration {
  return merge(
    webpackUtils.buildCommonConfig(env, __filename),
    webpackUtils.buildSharedLibraryConfig(__filename),
    {
      output: {
        filename: 'core.js',
        libraryTarget: 'system',
      },
      plugins: [
        new ManifestPlugin({
          fileName: 'manifest.core.json',
        }),
      ],
    }
  )
}
