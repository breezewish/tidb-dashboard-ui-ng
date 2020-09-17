import fs from 'fs'
import path from 'path'
import webpack from 'webpack'
import * as utils from './utils'

function loadEnvFile(projPath) {
  const dotenvPath = path.join(projPath, '.env')
  const files = [
    `${dotenvPath}.${utils.NODE_ENV}.local`,
    `${dotenvPath}.${utils.NODE_ENV}`,
    dotenvPath,
  ]
  files.forEach((dotenvFile) => {
    if (fs.existsSync(dotenvFile)) {
      require('dotenv-expand')(
        require('dotenv').config({
          path: dotenvFile,
        })
      )
    }
  })
}

export function buildEnvDef(currentFilePath): webpack.Configuration {
  loadEnvFile(path.dirname(currentFilePath))
  const raw = Object.keys(process.env)
    .filter((key) => /^REACT_APP_/i.test(key))
    .reduce(
      (env, key) => {
        env[key] = process.env[key]
        return env
      },
      {
        NODE_ENV: process.env.NODE_ENV,
      }
    )
  const stringified = {
    'process.env': Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key])
      return env
    }, {}),
  }
  return {
    plugins: [new webpack.DefinePlugin(stringified)],
  }
}
