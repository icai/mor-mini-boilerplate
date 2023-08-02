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
  /**
   * 支付宝小程序转 Web 编译配置
   */
  // {
  //   name: 'web',
  //   sourceType: 'alipay',
  //   target: 'web',
  //   globalObject: 'customMy',
  //   web: {
  //     showBack: true,
  //     responsiveRootFontSize: 16,
  //     // devServer: {
  //     //   host: 'local-ip',
  //     //   port: 8888
  //     // },
  //     appConfig: {
  //       apiNoConflict: false,
  //       components: {
  //         map: {
  //           sdk: '', // 地图 sdk 地址
  //           version: '', // 地图 sdk 版本
  //           key: '' // 个人地图 key
  //         }
  //       }
  //     }
  //   }
  // }
])
