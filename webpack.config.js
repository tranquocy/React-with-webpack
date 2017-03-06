module.exports = {
  devtool: 'eval-source-map',
  entry: __dirname + "/app/main.js",
  output: {
    path: __dirname + "/public",
    filename: "bundle.js"
  },

  module: { 
   loaders: [ 
      { 
        test: /\.json$/,
        exclude: /node_modules/,
        loader: 'json-loader'
      } 
    ] 
  }, 

  devServer: {
    contentBase: "./public",
    historyApiFallback: true,
    inline: true
  }
}