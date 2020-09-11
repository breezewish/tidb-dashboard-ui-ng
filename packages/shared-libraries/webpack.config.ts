import path from 'path'
import webpack from 'webpack'
import merge from 'webpack-merge'
import CopyPlugin from 'copy-webpack-plugin'
import ManifestPlugin from 'webpack-manifest-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import * as webpackUtils from '@tidb-dashboard/build-scripts/webpack/utils'

function commonLib(env: webpackUtils.WebpackEnv): webpack.Configuration {
  // Some eager loaded shared libraries, which will be directly included in HTML.
  return merge(webpackUtils.buildWatchConfig(env), {
    context: __dirname,
    mode: env,
    entry: {
      _eagerLibs: './src',
    },
    output: {
      path: path.join(__dirname, 'build/common'),
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: webpackUtils.modulePath(
              'react',
              env === 'development'
                ? 'umd/react.development.js'
                : 'umd/react.production.min.js'
            ),
            flatten: true,
          },
          {
            from: webpackUtils.modulePath(
              'react-dom',
              env === 'development'
                ? 'umd/react-dom.development.js'
                : 'umd/react-dom.production.min.js'
            ),
            flatten: true,
          },
          {
            from: webpackUtils.modulePath(
              'moment',
              env === 'development' ? 'moment.js' : 'min/moment.min.*'
            ),
            flatten: true,
          },
          {
            from: webpackUtils.modulePath(
              'antd',
              env === 'development' ? 'dist/antd.js*' : 'dist/antd.min.js*'
            ),
            flatten: true,
          },
          {
            from: webpackUtils.modulePath(
              'history',
              env === 'development'
                ? 'umd/history.development.js*'
                : 'umd/history.production.min.js*'
            ),
            flatten: true,
          },
          {
            from: webpackUtils.modulePath(
              'react-router',
              env === 'development'
                ? 'umd/react-router.development.js*'
                : 'umd/react-router.production.min.js*'
            ),
            flatten: true,
          },
          {
            from: webpackUtils.modulePath(
              'react-router-dom',
              env === 'development'
                ? 'umd/react-router-dom.development.js*'
                : 'umd/react-router-dom.production.min.js*'
            ),
            flatten: true,
          },
          {
            from: webpackUtils.modulePath(
              'lodash',
              env === 'development' ? 'lodash.js' : 'lodash.min.js'
            ),
            flatten: true,
          },
          {
            from: webpackUtils.modulePath('dayjs', 'dayjs.min.js'),
            flatten: true,
          },
          // Note: When introducing new libraries, you also need to modify externs.json
        ],
      }),
      new ManifestPlugin({
        fileName: 'manifest.libs_common.json',
      }),
      new CleanWebpackPlugin(),
    ],
  })
}

// A custom built library that does not contain default initialized icons
function fabricLib(env: webpackUtils.WebpackEnv): webpack.Configuration {
  // TODO: Replace with esbuild when https://github.com/evanw/esbuild/issues/337 is resolved
  return merge(
    webpackUtils.buildCommonConfig(env, __filename),
    webpackUtils.buildFSCacheConfig(env, __filename),
    webpackUtils.buildWatchConfig(env),
    {
      entry: {
        fabric: 'office-ui-fabric-react/lib/index.js',
      },
      output: {
        path: path.join(__dirname, 'build/fabric'),
        library: 'Fabric',
      },
      plugins: [
        new ManifestPlugin({
          fileName: 'manifest.libs_fabric.json',
        }),
      ],
      externalsType: 'global',
      externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
      },
    }
  )
}

export default function config(
  env: webpackUtils.WebpackEnv
): webpack.Configuration[] {
  return [commonLib(env), fabricLib(env)]
}
