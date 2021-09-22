const path = require("path");
const { VueLoaderPlugin } = require('vue-loader');
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");


const isProd = process.env.NODE_ENV === "production";
const rootDir = path.resolve(__dirname, '../');
const stylesHandler = isProd ? MiniCssExtractPlugin.loader : "style-loader";

module.exports = {
    output: {
        path: path.resolve(rootDir, 'dist'),
        filename: '[name].js',
        clean: true,
        library: {
            name: 'VideoPlayer',
            type: 'umd',
        },
    },

    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        alias: {
            vue$: 'vue/dist/vue.esm.js', //解决 Vue.component 动态创建报错
            '@': path.resolve(rootDir, 'src'),
        },
    },

    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                exclude: ["/node_modules/"],
            },
            {
                test: /\.tsx?$/,
                use: [
                    'babel-loader',
                    {
                        loader: 'ts-loader',
                        options: { 
                            appendTsSuffixTo: [/\.vue$/],
                            compiler: 'ttypescript',
                        },
                    }
                ],
                exclude: ["/node_modules/"],
            },
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: ["/node_modules/"],
            },
            {
                test: /\.s[ac]ss$/,
                use: [stylesHandler, 'css-loader', 'sass-loader'],
            },
            {
                test: /\.css$/i,
                use: [stylesHandler, "css-loader"],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: "asset",
            },
        ]
    },

    plugins: [
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin(),
    ],

    optimization: {
        // moduleIds: 'deterministic',
        // runtimeChunk: 'single',
        // splitChunks: {
        //     chunks: 'all',
        //     cacheGroups: {
        //       vendors: {
        //         test: /[\\/]node_modules[\\/]/,
        //         name: 'vendors',
        //         chunks: 'all',
        //       },
        //     },
        // },
        minimize: true,
        minimizer: [
            // 取消提取LICENSE.txt (会导致使用vue-property-decorator的组件全局注册时无法正确解析)
            // new TerserPlugin({
            //     extractComments: false,
            // }),
            // 压缩css
            new CssMinimizerPlugin(),
        ],
    },
        
}