import path from 'path'
import { merge } from 'webpack-merge'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import HtmlWebpackTagsPlugin from 'html-webpack-tags-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import * as webpackUtils from '@tidb-dashboard/build-scripts/webpack/utils'
import { ROOT_DIR } from '@tidb-dashboard/build-scripts/webpack/utils'

function generateImportMapImports() {
  const sharedLibraryImports = Object.fromEntries(
    Object.entries(
      require('@tidb-dashboard/shared-libraries/build/manifest.shared-libraries.json')
    )
      .map(([name, path]) => {
        if (!name.endsWith('.js')) {
          return false
        }
        return [name.replace(/\.js$/, ''), './' + path]
      })
      .filter(Boolean) as [string, string][]
  )
  return {
    ...sharedLibraryImports,
    '@tidb-dashboard/core':
      './' +
      require('@tidb-dashboard/core/build/manifest.core.json')['core.js'],
    '@tidb-dashboard/ui':
      './' +
      require('@tidb-dashboard/ui/build/lib/manifest.ui_lib.json')['ui.js'],
  }
}

export default function (env: webpackUtils.WebpackEnv): webpack.Configuration {
  return merge(
    webpackUtils.buildCommonConfig(env, __filename),
    webpackUtils.buildSharedLibraryConfig(__filename),
    webpackUtils.buildBaseLibraryConfig(),
    {
      entry: {
        app: './src',
      },
      output: {
        library: 'app',
      },
      plugins: [
        new CopyPlugin({
          patterns: [
            {
              context: path.dirname(
                require.resolve('systemjs/dist/system.min.js')
              ),
              from: '**/*',
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
            'system.js',
            'extras/named-register.js',
            'extras/amd.js',
            // manifestUiStyles['light.css'],
          ],
        }),
        new HtmlWebpackPlugin({
          template: 'public/index.html',
          templateParameters: {
            imports: generateImportMapImports(),
          },
          inject: false,
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

  // return {}
}
