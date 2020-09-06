import webpack from 'webpack'
import { ESBuildMinifyPlugin } from 'esbuild-loader'

const config: webpack.Configuration = {
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    minimize: true,
    minimizer: [new ESBuildMinifyPlugin()],
  },
}

export default config
