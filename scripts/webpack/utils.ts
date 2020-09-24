import { createRequire } from 'module'
import path from 'path'
import webpack from 'webpack'
import merge from 'webpack-merge'
import devConfig from './dev.config'
import prodConfig from './prod.config'
import buildCommonSharedConfig from './shared.config'

if (!process.env.NODE_ENV) {
  throw new Error('NODE_ENV environment variable is required')
}

if (['development', 'production'].indexOf(process.env.NODE_ENV) === -1) {
  throw new Error('NODE_ENV environment variable is invalid')
}

export type WebpackEnv = 'development' | 'production'

export const ROOT_DIR = path.resolve(__dirname, '../../')

export const NODE_ENV = process.env.NODE_ENV as WebpackEnv

export function getCssLoaders(options?: any) {
  return [
    {
      loader: require.resolve('css-loader'),
      options: {
        sourceMap: NODE_ENV === 'production',
        ...options,
      },
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        postcssOptions: {
          config: path.resolve(__dirname, '../postcss.config.js'),
        },
        sourceMap: NODE_ENV === 'production',
      },
    },
  ]
}

function getCssPreprocessorLoaders(preProcessor: string, options?: any): any[] {
  return [
    {
      loader: require.resolve('resolve-url-loader'),
      options: {
        sourceMap: NODE_ENV === 'production',
      },
    },
    {
      loader: require.resolve(preProcessor),
      options: {
        sourceMap: NODE_ENV === 'production',
        ...options,
      },
    },
  ]
}

export function getLessLoaders(): any[] {
  return getCssPreprocessorLoaders('less-loader', {
    lessOptions: {
      javascriptEnabled: true,
    },
  })
}

export function buildFSCacheConfig(
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
    cache: NODE_ENV === 'production' ? false : cacheConfig,
  }
}

export function buildCommonConfig(
  currentFilePath: string
): webpack.Configuration {
  if (NODE_ENV === 'development') {
    return merge(devConfig, buildCommonSharedConfig(currentFilePath))
  } else if (NODE_ENV === 'production') {
    return merge(prodConfig, buildCommonSharedConfig(currentFilePath))
  } else {
    throw new Error('Unreachable')
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

export function buildWatchConfig(): webpack.Configuration {
  if (NODE_ENV !== 'development') {
    return {}
  }
  return {
    watch: true,
    stats: { preset: 'minimal', warnings: false },
  }
}

export function buildStandardAppConfig(
  currentFilePath: string
): webpack.Configuration {
  return merge(
    buildCommonConfig(currentFilePath),
    buildLibraryConfig(currentFilePath),
    buildFSCacheConfig(currentFilePath),
    buildWatchConfig(),
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
