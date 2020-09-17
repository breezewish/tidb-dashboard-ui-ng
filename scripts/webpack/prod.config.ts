import { ESBuildMinifyPlugin } from 'esbuild-loader'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import webpack from 'webpack'

const config: webpack.Configuration = {
  devtool: 'source-map',
  optimization: {
    minimize: true,
    minimizer: [new ESBuildMinifyPlugin()],
  },
  plugins: [
    // Only used in production mode
    new ForkTsCheckerWebpackPlugin(),
  ],
}

export default config
