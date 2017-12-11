module.exports = {
    entry: './src/app.js',
    output: {
        path: __dirname,
        filename: './dist/js/bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: { presets: [ 'env' ] }
            }
        ]
    }
};