const path = require('path');
const babel = require('babel-core/register');
const webpack = require('webpack');

const src = './src';
const dest = '';

const relativeSrcPath = path.relative('.', src);

module.exports = {
  dest: dest,

  js: {
    src: src + '/js/**',
    dest: dest,
    uglify: false
  },

  eslint: {
    src: [
      src + '/js/**',
      './test/**/*.js',
    ],
    opts: {
      useEslintrc: true
    }
  },

  webpack: {
    node: {
      target: 'node',
      entry: src + '/TGAImage.js',
      output: {
        path: dest,
        filename: 'index.node.js',
        library: 'TGAImage',
        libraryTarget: 'commonjs2'
      },
      resolve: {
        extensions: ['.js']
      },
      plugins: [
        new webpack.DefinePlugin({'process.env.BROWSER': false})
      ],
      module: {
        loaders: [
          {
            test: /\.js$/,
            exclude: [/node_modules/],
            loader: 'babel-loader',
            query: {
              presets: ['es2015']
            }
          }
        ]
      },
      externals: {
      }
    },
    web: {
      target: 'web',
      entry: src + '/TGAImage.js',
      output: {
        path: dest,
        filename: 'index.web.js',
        library: 'TGAImage',
        libraryTarget: 'commonjs2'
      },
      resolve: {
        extensions: ['.js']
      },
      plugins: [
        new webpack.DefinePlugin({'process.env.BROWSER': true})
      ],
      module: {
        loaders: [
          {
            test: /\.js$/,
            exclude: [/node_modules/],
            loader: 'babel-loader',
            query: {
              presets: ['es2015']
            }
          }
        ]
      },
      node: {
        Buffer: true
      },
      externals: {
      }
    },
    webmin: {
      target: 'web',
      entry: src + '/TGAImage.js',
      output: {
        path: dest,
        filename: 'tgaimage.min.js',
        library: 'TGAImage',
        libraryTarget: 'var'
      },
      resolve: {
        extensions: ['.js']
      },
      plugins: [
        new webpack.DefinePlugin({'process.env.BROWSER': true})
        //new webpack.DefinePlugin({'process.env.BROWSER': true}),
        //new webpack.optimize.UglifyJsPlugin()
      ],
      module: {
        loaders: [
          {
            test: /\.js$/,
            exclude: [/node_modules/],
            loader: 'babel-loader',
            query: {
              presets: ['es2015']
            }
          }
        ]
      },
      node: {
        Buffer: true
      },
      externals: {
      }
    }

  },

  mocha: {
    src: ['test/**/*.js', 'src/**/*.js', '!src/**/*.web.js'],
    compilers: {
      js: babel
    },
    opts: {
      ui: 'bdd',
      reporter: 'spec', // or nyan
      globals: [],
      require: ['test/helper/testHelper', 'chai']
    }
  },

  copy: {
    src: [
    ],
    dest: dest
  },

  watch: {
    js: relativeSrcPath + '/js/**'
  }
}

