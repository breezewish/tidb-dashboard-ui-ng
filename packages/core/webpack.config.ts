import webpack from 'webpack'
import { merge } from 'webpack-merge'
import ManifestPlugin from 'webpack-manifest-plugin'
import * as webpackUtils from '@tidb-dashboard/build-scripts/webpack/utils'

export default function config(
  env: webpackUtils.WebpackEnv
): webpack.Configuration {
  return merge(
    webpackUtils.buildCommonConfig(env, __filename),
    webpackUtils.buildLibraryConfig(__filename, true),
    webpackUtils.buildFSCacheConfig(env, __filename),
    webpackUtils.buildWatchConfig(env),
    {
      entry: {
        core: './src',
      },
      output: {
        library: 'DashboardCore',
        libraryTarget: 'global',
      },
      plugins: [
        new ManifestPlugin({
          fileName: 'manifest.core.json',
        }),
      ],
    }
  )
}
