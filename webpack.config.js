const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const IS_DEVELOPMENT = !IS_PRODUCTION;

// console.log('PRODUCTION', IS_PRODUCTION);
// console.log('DEVELOPMENT', IS_DEVELOPMENT);

const filename = ext => IS_DEVELOPMENT ? `bundle.${ ext }` : `bundle.${ ext }`;
const jsLoaders = () => {
	const LOADERS = [
		{
	        loader: 'babel-loader',
	        options: {
	        	presets: ['@babel/preset-env']
	        }
		}
	];

	if(IS_DEVELOPMENT){
		LOADERS.push('eslint-loader')
	}

	return LOADERS;
};

module.exports = {
	context: path.resolve(__dirname, 'src'),
	mode: 'development',
	entry: ['@babel/polyfill', './index.js'],
	output: {
		filename: filename('js'),
        path: path.resolve(__dirname, 'public/bundles'),
        publicPath: '/public'
	},
	resolve: {
		extensions: ['.js'],
		alias: {
			'@': path.resolve(__dirname, 'src'),
			'@core': path.resolve(__dirname, 'src/core')
		}
	},
	devtool: IS_DEVELOPMENT ? 'source-map' : false,
	devServer: {
	    contentBase: path.resolve(__dirname, 'dist'),
	    compress: true,
	    port: 9000,
	    hot: IS_DEVELOPMENT
	},
	plugins: [
		new CleanWebpackPlugin(),
		new CopyPlugin({
	      patterns: [
	        { from: path.resolve(__dirname, 'src/favicon.ico'), to: path.resolve(__dirname, 'public') },
	      ],
	    }),
	    new MiniCssExtractPlugin({
	    	filename: filename('css'),
        }),
        new FileManagerPlugin({
            onEnd: [
                {
                  copy: [
                    { source: "public/bundles/bundle.js", destination: "public/javascripts/bundle.js" },
                    { source: "public/bundles/bundle.css", destination: "public/stylesheets/bundle.css" }
                  ]
                },
                {
                  delete: [
                    "public/bundles"
                  ]
                }
              ]
        })
	],
	  module: {
	    rules: [
	      {
	        test: /\.s[ac]ss$/i,
	        use: [
	           {
	           	 loader: MiniCssExtractPlugin.loader,
	           	 options: {
	           	 	hmr: IS_DEVELOPMENT,
	           	 	reloadAll: true
	           	 }
	           },
	          'css-loader',
	          'sass-loader',
	        ],
	      },
	      {
		      test: /\.m?js$/,
		      exclude: /(node_modules|bower_components)/,
		      use: jsLoaders()
		  }
	    ],
	  },
};