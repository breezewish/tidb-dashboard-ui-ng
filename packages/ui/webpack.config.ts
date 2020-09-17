import path from 'path'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import webpack from 'webpack'
import ManifestPlugin from 'webpack-manifest-plugin'
import { merge } from 'webpack-merge'
import * as webpackUtils from '@tidb-dashboard/build-scripts/webpack/utils'

function libraryConfig(): webpack.Configuration {
  return merge(
    webpackUtils.buildCommonConfig(__filename),
    webpackUtils.buildLibraryConfig(__filename),
    webpackUtils.buildFSCacheConfig(__filename),
    webpackUtils.buildWatchConfig(),
    {
      entry: {
        ui: './src',
      },
      output: {
        path: path.join(__dirname, 'build/lib'),
        library: 'DashboardUi',
        libraryTarget: 'global',
      },
      plugins: [
        new ManifestPlugin({
          fileName: 'manifest.ui_lib.json',
        }),
      ],
    }
  )
}

function styleConfig(): webpack.Configuration {
  return merge(
    webpackUtils.buildFSCacheConfig(__filename),
    webpackUtils.buildWatchConfig(),
    {
      mode: webpackUtils.NODE_ENV,
      context: __dirname,
      entry: {
        light: './styles/full/light.less',
        dark: './styles/full/dark.less',
      },
      output: {
        path: path.join(__dirname, 'build/styles'),
      },
      module: {
        rules: [
          {
            test: /\.less$/,
            use: [
              MiniCssExtractPlugin.loader,
              ...webpackUtils.getCssLoaders({
                importLoaders: 3,
              }),
              ...webpackUtils.getLessLoaders(),
            ],
            sideEffects: true,
          },
        ],
      },
      plugins: [
        new MiniCssExtractPlugin(),
        new CleanWebpackPlugin(),
        new ManifestPlugin({
          fileName: 'manifest.ui_styles.json',
        }),
      ],
    }
  )
}

export default function config(): webpack.Configuration[] {
  return [libraryConfig(), styleConfig()]
}
