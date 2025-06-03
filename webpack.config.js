const path = require('path');

module.exports = {
  entry: './src/index.js', // Entry point for your app
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist') // Output to dist folder
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/, // Transpile .js and .jsx files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/, // Handle CSS files
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'] // Resolve .js and .jsx extensions
  }
};
