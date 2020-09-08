import path from 'path'
import webpack from 'webpack'
import merge from 'webpack-merge'
import { createRequire } from 'module'
import buildCommonShredConfig from './shared.config'
import devConfig from './dev.config'
import prodConfig from './prod.config'

export type WebpackEnv = 'development' | 'production'

export const ROOT_DIR = path.resolve(__dirname, '../../')

export function getCssLoaders(env: WebpackEnv, options?: any) {
  return [
    {
      loader: require.resolve('css-loader'),
      options: {
        sourceMap: env === 'production',
        ...options,
      },
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        ident: 'postcss',
        plugins: () => [
          require('postcss-flexbugs-fixes'),
          require('postcss-preset-env')({
            autoprefixer: {
              flexbox: 'no-2009',
            },
            stage: 3,
          }),
        ],
        sourceMap: env === 'production',
      },
    },
  ]
}

function getCssPreprocessorLoaders(
  preProcessor: string,
  env: WebpackEnv,
  options?: any
): any[] {
  return [
    {
      loader: require.resolve('resolve-url-loader'),
      options: {
        sourceMap: env === 'production',
      },
    },
    {
      loader: require.resolve(preProcessor),
      options: {
        sourceMap: env === 'production',
        ...options,
      },
    },
  ]
}

export function getLessLoaders(env: WebpackEnv): any[] {
  return getCssPreprocessorLoaders('less-loader', env, {
    lessOptions: {
      javascriptEnabled: true,
    },
  })
}

export function getFileSystemCacheConfig(
  currentFilePath,
  additionalDependencies?: any
): webpack.Configuration['cache'] {
  return {
    type: 'filesystem',
    buildDependencies: {
      sharedBuildScript: [__dirname + path.sep],
      config: [currentFilePath],
      ...additionalDependencies,
    },
  }
}

export function buildCommonConfig(
  env: WebpackEnv,
  currentFilePath: string
): webpack.Configuration {
  if (env === 'development') {
    return merge(devConfig, buildCommonShredConfig(env, currentFilePath))
  } else if (env === 'production') {
    return merge(prodConfig, buildCommonShredConfig(env, currentFilePath))
  } else {
    throw new Error('Expect env to be development or production')
  }
}

export function buildSharedLibraryConfig(
  currentFilePath: string
): webpack.Configuration {
  const requireAtPlace = createRequire(currentFilePath)
  return {
    output: {
      libraryTarget: 'amd',
    },
    resolve: {
      alias: {
        ...requireAtPlace(
          '@tidb-dashboard/shared-libraries/libraries-alias.json'
        ),
      },
    },
    externals: Object.fromEntries(
      requireAtPlace(
        '@tidb-dashboard/shared-libraries/libraries.json'
      ).map((p) => [p, p])
    ),
  }
}

export function buildBaseLibraryConfig(): webpack.Configuration {
  return {
    output: {
      libraryTarget: 'amd',
    },
    externals: Object.fromEntries(
      ['@tidb-dashboard/core', '@tidb-dashboard/ui'].map((p) => [p, p])
    ),
  }
}
