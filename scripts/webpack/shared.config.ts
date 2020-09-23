import path from 'path'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import { ESBuildPlugin } from 'esbuild-loader'
import webpack from 'webpack'
import merge from 'webpack-merge'
import WebpackBar from 'webpackbar'
import * as env from './env'
import * as utils from './utils'

export default function sharedConfig(
  currentFilePath: string
): webpack.Configuration {
  const dirName = path.dirname(currentFilePath)
  return merge(env.buildEnvDef(currentFilePath), {
    mode: utils.NODE_ENV,
    context: dirName,
    output: {
      path: path.join(dirName, 'build'),
    },
    resolve: {
      extensions: ['.js', '.json', '.ts', '.tsx', '.js', '.jsx'],
    },
    module: {
      rules: [
        {
          oneOf: [
            {
              test: /\.ya?ml$/,
              type: 'json',
              use: require.resolve('yaml-loader'),
            },
            {
              test: /\.svg$/,
              issuer: /\.[tj]sx?$/,
              loader: require.resolve('@svgr/webpack'),
            },
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
              use: [
                {
                  loader: require.resolve('url-loader'),
                  options: {
                    name: '[name].[hash:8].[ext]',
                  },
                },
                {
                  loader: require.resolve('image-webpack-loader'),
                  options: {
                    disable: utils.NODE_ENV === 'development',
                    mozjpeg: {
                      enabled: false,
                    },
                    optipng: {
                      enabled: false,
                    },
                    pngquant: {
                      enabled: false,
                    },
                    gifsicle: {
                      enabled: false,
                    },
                  },
                },
              ],
            },
            {
              test: [/\.ttf$/, /\.eot$/, /\.woff2?$/],
              loader: require.resolve('url-loader'),
              options: {
                name: '[name].[hash:8].[ext]',
              },
            },
            {
              test: /\.[tj]sx?$/,
              loader: require.resolve('esbuild-loader'),
              options: {
                loader: 'tsx',
                // FIXME: Change to es2015 after https://github.com/evanw/esbuild/issues/388 is fixed
                target: 'es2017',
              },
            },
            {
              test: /\.css$/,
              exclude: /\.module\.css$/,
              use: [
                require.resolve('style-loader'),
                ...utils.getCssLoaders({
                  importLoaders: 1,
                }),
              ],
              sideEffects: true,
            },
            {
              test: /\.module\.css$/,
              use: [
                require.resolve('style-loader'),
                ...utils.getCssLoaders({
                  importLoaders: 1,
                  modules: true,
                }),
              ],
            },
            {
              test: /\.less$/,
              exclude: /\.module\.less$/,
              use: [
                require.resolve('style-loader'),
                ...utils.getCssLoaders({
                  importLoaders: 3,
                }),
                ...utils.getLessLoaders(),
              ],
              sideEffects: true,
            },
            {
              test: /\.module\.less$/,
              use: [
                require.resolve('style-loader'),
                ...utils.getCssLoaders({
                  importLoaders: 3,
                  modules: true,
                }),
                ...utils.getLessLoaders(),
              ],
            },
          ],
        },
      ],
    },
    plugins: [new ESBuildPlugin(), new CleanWebpackPlugin(), new WebpackBar()],
  })
}
