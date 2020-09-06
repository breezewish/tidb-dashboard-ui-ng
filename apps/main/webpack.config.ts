import { merge } from 'webpack-merge'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import * as webpackUtils from '@tidb-dashboard/build-scripts/webpack/utils'

export default function (env: webpackUtils.WebpackEnv): webpack.Configuration {
  return merge(
    webpackUtils.buildCommonConfig(env, __filename),
    webpackUtils.buildSharedLibraryConfig(__filename),
    webpackUtils.buildBaseLibraryConfig(),
    {
      plugins: [
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
