import path from 'path'
import webpack from 'webpack'
import ManifestPlugin from 'webpack-manifest-plugin'
import { merge } from 'webpack-merge'
import * as webpackUtils from '@tidb-dashboard/build-scripts/webpack/utils'

export default function config(): webpack.Configuration {
  return merge(
    webpackUtils.buildCommonConfig(__filename),
    webpackUtils.buildLibraryConfig(__filename, true),
    // webpackUtils.buildFSCacheConfig(__filename),
    webpackUtils.buildWatchConfig(),
    {
      resolve: {
        alias: {
          '@core': path.resolve(__dirname, './src'),
        },
      },
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
