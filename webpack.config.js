const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
    entry: './script.js',  // Pastikan path ini mengarah ke file script.js Anda
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),  // Output file akan disimpan di folder dist
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'dist'),  // Folder untuk file statis
        },
        port: 9000,  // Port untuk dev server
    },
    module: {
        rules: [
            {
                test: /\.js$/,  // Menggunakan babel untuk transpilasi JS
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/,  // Menambahkan rule untuk file CSS
                use: [MiniCssExtractPlugin.loader, 'css-loader'],  // Menggunakan MiniCssExtractPlugin untuk ekstraksi CSS
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',  // Menggunakan index.html yang ada di NotesApp
        }),
        new MiniCssExtractPlugin({
            filename: 'style.css',  // Menyimpan CSS dalam file terpisah dengan nama 'style.css'
        }),
    ],
};
