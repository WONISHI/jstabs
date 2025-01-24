import babel from '@rollup/plugin-babel'
import serve from 'rollup-plugin-serve'
import json from '@rollup/plugin-json'
import strip from '@rollup/plugin-strip'
import html from '@rollup/plugin-html'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import replace from '@rollup/plugin-replace'
import alias from '@rollup/plugin-alias'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

// 获取当前文件的绝对路径
const __filename = fileURLToPath(import.meta.url)
// 获取当前文件所在的目录
const __dirname = path.dirname(__filename)

// 读取 src/demo.html 文件
const template = fs.readFileSync(path.resolve(__dirname, 'src/index.html'), 'utf8')

const format = process.env.BUILD_FORMAT || 'umd'
const npm_lifecycle_event = process.env.npm_lifecycle_event
process.env.VUE_APP_PACKAGE_ENV = npm_lifecycle_event && npm_lifecycle_event.indexOf('build') > -1 ? 'build' : 'serve'

export default {
  input: './src/index.js',
  output: {
    file: `dist/index.js`,
    name: 'JsTabs',
    format,
    sourcemap: false
  },
  plugins: [
    json(),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'dev')
    }),
    resolve(),
    commonjs(),
    terser({
      compress: {
        keep_fnames: true, // 保留函数名
        keep_classnames: true, // 保留类名
        drop_console: false, // 不移除 console.log
        pure_funcs: []
      }
    }),
    babel({
      babelHelpers: 'bundled', // 使用 bundled 模式
      exclude: 'node_modules/**', // 排除 node_modules
      presets: ['@babel/preset-env'] // 使用 @babel/preset-env
    }),
    alias({
      entries: [{ find: '@', replacement: path.resolve(__dirname, 'src') }]
    }),
    html({
      fileName: 'index.html',
      publicPath: '/',
      attributes: {
        lang: 'en'
      },
      template: () => template // 直接使用 demo.html 的内容
    }),
    ...(process.env.VUE_APP_PACKAGE_ENV !== 'build'
      ? [
          serve({
            port: 3000,
            open: process.env.VUE_APP_PACKAGE_ENV === 'build' ? false : true,
            contentBase: 'dist'
          })
        ]
      : [])
  ]
}
