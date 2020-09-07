import path from 'path'
import { merge } from 'webpack-merge'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import HtmlWebpackTagsPlugin from 'html-webpack-tags-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import * as webpackUtils from '@tidb-dashboard/build-scripts/webpack/utils'
import { ROOT_DIR } from '@tidb-dashboard/build-scripts/webpack/utils'

export default function (env: webpackUtils.WebpackEnv): webpack.Configuration {
  const manifestSharedLibrary = require('@tidb-dashboard/shared-libraries/build/manifest.shared-libraries.json')
  const manifestCore = require('@tidb-dashboard/core/build/manifest.core.json')
  const manifestUiLib = require('@tidb-dashboard/ui/build/lib/manifest.ui_lib.json')
  const manifestUiStyles = require('@tidb-dashboard/ui/build/styles/manifest.ui_styles.json')

  return merge(
    webpackUtils.buildCommonConfig(env, __filename),
    webpackUtils.buildSharedLibraryConfig(__filename),
    webpackUtils.buildBaseLibraryConfig(),
    {
      plugins: [
        new CopyPlugin({
          patterns: [
            {
              context: path.dirname(
                require.resolve('systemjs/dist/system.min.js')
              ),
              from: 'system.min.*',
            },
            {
              context: `${ROOT_DIR}/packages/shared-libraries/build`,
              from: '**/*',
            },
            {
              context: `${ROOT_DIR}/packages/core/build`,
              from: '**/*',
            },
            {
              context: `${ROOT_DIR}/packages/ui/build/lib`,
              from: '**/*',
            },
            {
              context: `${ROOT_DIR}/packages/ui/build/styles`,
              from: '**/*',
            },
          ],
        }),
        new HtmlWebpackTagsPlugin({
          append: false,
          tags: [
            'system.min.js',
            manifestSharedLibrary['main.js'],
            manifestCore['main.js'],
            manifestUiLib['main.js'],
            manifestUiStyles['light.css'],
            // manifestUiStyles['dark.css'],
          ],
        }),
        new HtmlWebpackPlugin({
          template: 'public/index.html',
          ...(env === 'production' && {
            minify: {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true,
            },
          }),
        }),
      ],
    }
  )
}
