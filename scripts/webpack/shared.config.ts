import path from 'path'
import webpack from 'webpack'
import { ESBuildPlugin } from 'esbuild-loader'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import * as utils from './utils'

export default function (
  env: utils.WebpackEnv,
  currentFilePath: string
): webpack.Configuration {
  const dirName = path.dirname(currentFilePath)
  return {
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
              test: /\.[tj]sx?$/,
              loader: require.resolve('esbuild-loader'),
              options: {
                loader: 'tsx',
                target: 'es2015',
              },
            },
            {
              test: /\.css$/,
              exclude: /\.module\.css$/,
              use: [
                require.resolve('style-loader'),
                ...utils.getCssLoaders(env, {
                  importLoaders: 1,
                }),
              ],
              sideEffects: true,
            },
            {
              test: /\.module\.css$/,
              use: [
                require.resolve('style-loader'),
                ...utils.getCssLoaders(env, {
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
                ...utils.getCssLoaders(env, {
                  importLoaders: 3,
                }),
                ...utils.getLessLoaders(env),
              ],
              sideEffects: true,
            },
            {
              test: /\.module\.less$/,
              use: [
                require.resolve('style-loader'),
                ...utils.getCssLoaders(env, {
                  importLoaders: 3,
                  modules: true,
                }),
                ...utils.getLessLoaders(env),
              ],
            },
          ],
        },
      ],
    },
    optimization: {
      runtimeChunk: {
        name: 'runtime',
      },
    },
    plugins: [
      new ESBuildPlugin(),
      new ForkTsCheckerWebpackPlugin(),
      new CleanWebpackPlugin(),
      new webpack.IgnorePlugin({
        contextRegExp: /moment$/,
        resourceRegExp: /^\.\/locale$/,
      }),
    ],
  }
}
