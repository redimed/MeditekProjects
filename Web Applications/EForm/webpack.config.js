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
        new webpack.ProvidePlugin({
            
        })
    ]
}