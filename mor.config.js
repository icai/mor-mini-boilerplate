import { defineConfig } from '@morjs/cli'
import { getDate } from './scripts/utils.js'
import { getEnv } from './scripts/env.js'
import MorJSPluginImageReplace from './scripts/plugins/imageReplace.js'

const injectEnv = getEnv()

export default defineConfig([
  {
    name: 'ali',
    sourceType: 'alipay',
    target: 'alipay',
    // compileMode: 'transform',
    // processNodeModules: false,
    // allowSyntheticDefaultImports: false,
    ignore: ['**/images/**/*'],
    compilerOptions: {
      target: 'ES2017'
    },
    conditionalCompile: {
      context: {
        buildTime: getDate(),
        ...injectEnv
      }
    },
    plugins: [new MorJSPluginImageReplace()]
  }
  //,
  // {
  //   name: 'ali',
  //   sourceType: 'alipay',
  //   target: 'wechat',
  //   // compileMode: 'transform',
  //   // processNodeModules: false,
  //   // allowSyntheticDefaultImports: false,
  //   ignore: ['**/images/**/*'],
  //   compilerOptions: {
  //     target: 'ES2017'
  //   },
  //   conditionalCompile: {
  //     context: {
  //       buildTime: getDate(),
  //       ...injectEnv
  //     }
  //   },
  //   plugins: [new MorJSPluginImageReplace()]
  // }
])
