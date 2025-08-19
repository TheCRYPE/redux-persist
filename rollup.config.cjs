const pluginNodeResolve = require('@rollup/plugin-node-resolve')
const pluginCommonjs = require('@rollup/plugin-commonjs')
const pluginTypescript = require('@rollup/plugin-typescript')
const pluginBabel = require('@rollup/plugin-babel').babel
const pluginTerser = require('@rollup/plugin-terser')
const path = require('path')
const pkg = require('./package.json')

const moduleName = 'ReduxPersist'

const banner = `/*!
  ${moduleName}.js v${pkg.version}
  ${pkg.homepage}
  Released under the ${pkg.license} License.
*/`

const filePath = 'dist/redux-persist.js'

const config = [
  // browser
  {
    // entry point
    input: 'src/index.ts',
    output: [
      // no minify
      {
        name: moduleName,
        file: filePath,
        format: 'umd',
        sourcemap: true,
        // copyright
        banner,
      },
      // minify
      {
        name: moduleName,
        file: filePath.replace('.js', '.min.js'),
        format: 'umd',
        sourcemap: true,
        banner,
        plugins: [pluginTerser()],
      },
    ],
    plugins: [
      pluginTypescript({
        module: 'esnext',
      }),
      pluginCommonjs({
        extensions: ['.js', '.ts'],
      }),
      pluginBabel({
        babelHelpers: 'bundled',
        configFile: path.resolve(__dirname, '.babelrc.cjs'),
      }),
      pluginNodeResolve({
        browser: true,
      }),
    ],
  },
]

module.exports = config
