import path from 'path'
import webpack from 'webpack'
import merge from 'webpack-merge'
import { createRequire } from 'module'
import buildCommonSharedConfig from './shared.config'
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

export function buildFSCacheConfig(
  env: WebpackEnv,
  currentFilePath: string,
  additionalDependencies?: any
): webpack.Configuration {
  const requireAtPlace = createRequire(currentFilePath)
  const cacheConfig: webpack.Configuration['cache'] = {
    type: 'filesystem',
    buildDependencies: {
      sharedBuildScript: [__dirname + path.sep],
      config: [currentFilePath],
      sharedLibraryExterns: [
        requireAtPlace.resolve('@tidb-dashboard/shared-libraries/externs.json'),
      ],
      ...additionalDependencies,
    },
  }
  return {
    cache: env === 'production' ? false : cacheConfig,
  }
}

export function buildCommonConfig(
  env: WebpackEnv,
  currentFilePath: string
): webpack.Configuration {
  if (env === 'development') {
    return merge(devConfig, buildCommonSharedConfig(env, currentFilePath))
  } else if (env === 'production') {
    return merge(prodConfig, buildCommonSharedConfig(env, currentFilePath))
  } else {
    throw new Error('Expect env to be development or production')
  }
}

export function buildLibraryConfig(
  currentFilePath: string,
  excludeDashboardLib?: boolean
): webpack.Configuration {
  const requireAtPlace = createRequire(currentFilePath)
  const dashboardExterns = {
    '@tidb-dashboard/core': 'DashboardCore',
    '@tidb-dashboard/ui': 'DashboardUi',
  }
  return {
    externalsType: 'global',
    externals: {
      ...requireAtPlace('@tidb-dashboard/shared-libraries/externs.json'),
      ...(excludeDashboardLib !== true ? dashboardExterns : {}),
    },
  }
}

export function buildWatchConfig(env: WebpackEnv): webpack.Configuration {
  if (env !== 'development') {
    return {}
  }
  return {
    watch: true,
    stats: { preset: 'minimal', warnings: false },
  }
}

export function buildStandardAppConfig(
  env: WebpackEnv,
  currentFilePath: string
): webpack.Configuration {
  return merge(
    buildCommonConfig(env, currentFilePath),
    buildLibraryConfig(currentFilePath),
    buildFSCacheConfig(env, currentFilePath),
    buildWatchConfig(env),
    {
      entry: {
        index: './src',
      },
    }
  )
}

export function importDir(fileName: string): string {
  return path.dirname(require.resolve(fileName))
}

export function modulePath(moduleName: string, rest: string): string {
  const basePath = importDir(`${moduleName}/package.json`)
  return path.join(basePath, rest)
}
