var HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

const config = {
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Sutom helper',
            hash: true,
            filename: './index.html', //relative to root of the application,
        }),
        new CopyPlugin({
            patterns: [
                { from: "dict", to: "dict" },
            ],
        }),
    ],
    devtool: "source-map",
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
        moduleIds: 'size'
    },
    watchOptions: {
        ignored: /\.#|node_modules|~$/,
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.glsl/,
                type: 'asset/source',
            }]
    },
    /*
    resolve : {
        fallback : {
            "buffer" : false 
        }
    }*/
}

module.exports = (env, args) => {
    if (args.mode === 'development') {
        delete config.optimization
    } else if (args.mode === 'production') {
        delete config.devtool
    }
    return config
}