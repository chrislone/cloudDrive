// craco.config.js
const CracoAlias = require('craco-alias') // 如果需要配置别名
const webpack = require('webpack')
// const path = require("path");
const CracoLessPlugin = require('craco-less')

module.exports = {
  typescript: {
    enableTypeChecking: true, // 如果你想让 craco 使用 TypeScript 编译器进行类型检查
  },
  style: {
    postcss: {
      plugins: [
        // require('postcss-import'),
        // require('tailwindcss'),
        // require('autoprefixer'),
      ],
    },
  },
  webpack: {
    alias: {
      // 自定义别名
      // "@": path.resolve(__dirname, "src"),
      // "@components": path.resolve(__dirname, "src/components"),
    },
    configure: (webpackConfig) => {
      webpackConfig.plugins.push(
        new webpack.ProvidePlugin({
          React: 'react',
        }),
      )

      // 其他配置更改...
      return webpackConfig
    },
  },
  devServer: {
    // 设置 devServer 的 open 选项为 false
    open: false,
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              // "@primary-color": "#1DA57A",
            }, // 自定义主题变量
            javascriptEnabled: true,
          },
        },
      },
    },
    {
      plugin: CracoAlias,
      options: {
        source: 'tsconfig',
        baseUrl: './src',
        // tsConfigPath should point to the file where "baseUrl" and "paths" are specified
        tsConfigPath: './tsconfig.extend.json',
      },
    },
  ],
}
