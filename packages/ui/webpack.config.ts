import path from 'path'
import webpack from 'webpack'
import { merge } from 'webpack-merge'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import ManifestPlugin from 'webpack-manifest-plugin'
import * as webpackUtils from '@tidb-dashboard/build-scripts/webpack/utils'

function libraryConfig(env: webpackUtils.WebpackEnv): webpack.Configuration {
  return merge(
    webpackUtils.buildCommonConfig(env, __filename),
    webpackUtils.buildSharedLibraryConfig(__filename),
    {
      entry: {
        ui: './src',
      },
      output: {
        path: path.join(__dirname, 'build/lib'),
      },
      externals: {
        '@tidb-dashboard/core': { amd: '@tidb-dashboard/core' },
      },
      plugins: [
        new ManifestPlugin({
          fileName: 'manifest.ui_lib.json',
        }),
      ],
    }
  )
}

function styleConfig(env: webpackUtils.WebpackEnv): webpack.Configuration {
  return {
    mode: env,
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
            ...webpackUtils.getCssLoaders(env, {
              importLoaders: 3,
            }),
            ...webpackUtils.getLessLoaders(env),
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
}

export default function (
  env: webpackUtils.WebpackEnv
): webpack.Configuration[] {
  return [libraryConfig(env), styleConfig(env)]
}
