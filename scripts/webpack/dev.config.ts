import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin'
import WatchMissingNodeModulesPlugin from 'react-dev-utils/WatchMissingNodeModulesPlugin'
import webpack from 'webpack'

const config: webpack.Configuration = {
  devtool: 'cheap-module-source-map',
  plugins: [
    new WatchMissingNodeModulesPlugin(),
    new CaseSensitivePathsPlugin(),
  ],
}

export default config
