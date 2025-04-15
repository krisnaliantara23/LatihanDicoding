const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/script.js',  // File JavaScript utama
  output: {
    filename: 'bundle.js',  // Nama file output setelah bundling
    path: path.resolve(__dirname, 'dist')  // Folder output
  },
  devServer: {
    contentBase: './dist',  // Folder yang berisi file yang akan disajikan oleh server development
    port: 8080,  // Port untuk menjalankan server development
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',  // Template HTML yang digunakan
    })
  ],
  mode: 'development'  // Mode development
};
