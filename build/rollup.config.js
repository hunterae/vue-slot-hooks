// rollup.config.js
import vue from 'rollup-plugin-vue'

// For setting the NODE Env to production
import replace from 'rollup-plugin-replace'

// Mininimize generated UMD code for UNPKG
import uglify from 'rollup-plugin-uglify-es'

// Parsing of command line arguments - See https://devhints.io/minimist
import minimist from 'minimist'

// More efficient transpiling than Bable
import buble from 'rollup-plugin-buble'

// Ability to resolve imports that do not provide extensions
import resolve from 'rollup-plugin-node-resolve'

const argv = minimist(process.argv.slice(2))

const config = {
  external: ['vue-inherit-slots'],
  input: 'src/plugin.js',
  output: {
    name: 'VueSlotHooks',
    exports: 'named',
    globals: {
      'vue-inherit-slots': 'VueInheritSlots'
    }
  },
  plugins: [
    resolve({
      main: true,
      extensions: ['.js']
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    vue({
      css: false,
      compileTemplate: true,
      template: {
        isProduction: true
      }
    }),
    buble({ objectAssign: 'Object.assign' })
  ]
}

// Only minify browser (iife) version
if (argv.format === 'iife') {
  config.plugins.push(
    uglify({
      sourceMap: true,
      ie8: true
    })
  )
}

export default config
