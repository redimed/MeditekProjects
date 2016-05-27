var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: path.join(__dirname,'client/working/main.js'),
    output: {
        filename: path.join(__dirname, 'client/build/bundle.js')
    },
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'jsx-loader?insertPragma=React.DOM&harmony'
            }
        ]
    },
    resolve: {
        root: path.join(__dirname, 'client/working'),
        extensions: ['', '.js', '.jsx']
    },
    resolveLoader: {
        root: path.join(__dirname, 'node_modules')
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
          compress: { warnings: false },
          comments: false,
          sourceMap: false,
          mangle: true,
          minimize: true
        })
    ]
}