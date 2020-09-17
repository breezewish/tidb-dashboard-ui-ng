import path from 'path'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import webpack from 'webpack'
import ManifestPlugin from 'webpack-manifest-plugin'
import merge from 'webpack-merge'
import * as webpackUtils from '@tidb-dashboard/build-scripts/webpack/utils'

function commonLib(): webpack.Configuration {
  // Some eager loaded shared libraries, which will be directly included in HTML.
  return merge(webpackUtils.buildWatchConfig(), {
    context: __dirname,
    mode: webpackUtils.NODE_ENV,
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
              webpackUtils.NODE_ENV === 'development'
                ? 'umd/react.development.js'
                : 'umd/react.production.min.js'
            ),
            flatten: true,
          },
          {
            from: webpackUtils.modulePath(
              'react-dom',
              webpackUtils.NODE_ENV === 'development'
                ? 'umd/react-dom.development.js'
                : 'umd/react-dom.production.min.js'
            ),
            flatten: true,
          },
          {
            from: webpackUtils.modulePath(
              'moment',
              webpackUtils.NODE_ENV === 'development'
                ? 'moment.js'
                : 'min/moment.min.*'
            ),
            flatten: true,
          },
          {
            from: webpackUtils.modulePath(
              'antd',
              webpackUtils.NODE_ENV === 'development'
                ? 'dist/antd.js*'
                : 'dist/antd.min.js*'
            ),
            flatten: true,
          },
          {
            from: webpackUtils.modulePath(
              'history',
              webpackUtils.NODE_ENV === 'development'
                ? 'umd/history.development.js*'
                : 'umd/history.production.min.js*'
            ),
            flatten: true,
          },
          {
            from: webpackUtils.modulePath(
              'react-router',
              webpackUtils.NODE_ENV === 'development'
                ? 'umd/react-router.development.js*'
                : 'umd/react-router.production.min.js*'
            ),
            flatten: true,
          },
          {
            from: webpackUtils.modulePath(
              'react-router-dom',
              webpackUtils.NODE_ENV === 'development'
                ? 'umd/react-router-dom.development.js*'
                : 'umd/react-router-dom.production.min.js*'
            ),
            flatten: true,
          },
          {
            from: webpackUtils.modulePath(
              'lodash',
              webpackUtils.NODE_ENV === 'development'
                ? 'lodash.js'
                : 'lodash.min.js'
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
function fabricLib(): webpack.Configuration {
  // TODO: Replace with esbuild when https://github.com/evanw/esbuild/issues/337 is resolved
  return merge(
    webpackUtils.buildCommonConfig(__filename),
    webpackUtils.buildFSCacheConfig(__filename),
    webpackUtils.buildWatchConfig(),
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

export default function config(): webpack.Configuration[] {
  return [commonLib(), fabricLib()]
}
