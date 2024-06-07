import type { Configuration } from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { name } from './package.json'
import { rules } from './webpack.rules'
import { plugins } from './webpack.plugins'
import { alias } from './webpack.alias'

const isDevelopment = process.env.NODE_ENV == 'development'
const isProduction = process.env.NODE_ENV === 'production'
const cssRegex = /\.css$/
const cssModuleRegex = /\.module\.css$/
const lessRegex = /\.less$/
const lessModuleRegex = /\.module\.less$/

const getCssLoaders = (cssOptions: any) => [
  isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
  {
    loader: 'css-loader',
    options: {
      importLoaders: 1,
      sourceMap: isDevelopment,
      ...cssOptions
    }
  },
  {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: [
          require('postcss-flexbugs-fixes'),
          isProduction && [
            'postcss-preset-env',
            {
              autoprefixer: {
                grid: true,
                flexbox: 'no-2009'
              },
              stage: 3
            }
          ]
        ].filter(Boolean)
      }
    }
  }
]

rules.push({
  test: cssRegex,
  exclude: cssModuleRegex,
  use: getCssLoaders({
    modules: {
      mode: 'icss'
    }
  }),
  sideEffects: true
})

rules.push({
  test: cssModuleRegex,
  use: getCssLoaders({
    modules: { localIdentName: `${name}_[local]_[hash:base64:5]` }
  })
})

rules.push({
  test: lessModuleRegex,
  use: [
    ...getCssLoaders({
      modules: { localIdentName: `${name}_[local]_[hash:base64:5]` },
      importLoaders: 3
    }),
    {
      loader: 'less-loader',
      options: {
        lessOptions: {
          javascriptEnabled: true
        }
      }
    }
  ],
  sideEffects: true
})

rules.push({
  test: lessRegex,
  exclude: lessModuleRegex,
  use: [
    ...getCssLoaders({
      modules: {
        mode: 'icss'
      },
      importLoaders: 3
    }),
    {
      loader: 'less-loader',
      options: {
        lessOptions: {
          javascriptEnabled: true
        }
      }
    }
  ]
})

plugins.push(new MiniCssExtractPlugin())
plugins.push(
  new HtmlWebpackPlugin({
    template: 'src/index.html',
    filename: 'index.html',
    cache: true,
    chunks: ['index']
  })
)

export const rendererConfig: Configuration = {
  module: {
    rules
  },
  plugins,
  resolve: {
    alias,
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json', '.less']
  }
}
