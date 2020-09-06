import webpack from 'webpack'
import WatchMissingNodeModulesPlugin from 'react-dev-utils/WatchMissingNodeModulesPlugin'
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin'

const config: webpack.Configuration = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  plugins: [
    new WatchMissingNodeModulesPlugin(),
    new CaseSensitivePathsPlugin(),
  ],
}

export default config
