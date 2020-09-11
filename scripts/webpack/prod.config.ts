import webpack from 'webpack'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import { ESBuildMinifyPlugin } from 'esbuild-loader'

const config: webpack.Configuration = {
  mode: 'production',
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
