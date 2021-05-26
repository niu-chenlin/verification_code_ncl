const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        main: path.join(__dirname, './src/index.js')
    },
    watch: true,
    output: {
        path: path.join(__dirname, 'dist'),
        filename: "[name].js?[hash]",
    },
    mode: "development",
    resolve: {
        extensions: ['.js', '.json']
    },
    module: {
        rules: [
            {
                test: /(\.jsx|\.js)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        "presets": ["@babel/preset-react", "@babel/preset-env"],
                        "plugins": ["@babel/plugin-transform-runtime"]
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader','css-loader']
            }
        ]
    },
    devServer: {
        port: 8001,
        inline: true,
        contentBase:  path.join(__dirname, "dist"),
    },
    devtool: "source-map",
    plugins: [
        new HtmlWebpackPlugin({
            template:"./src/index.html",
            filename: './index.html',
            inject: 'body',
            // favicon: path.join(__dirname, "dashboards/static/img/favicon.ico")
        })
    ]
};