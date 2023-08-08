import { defineConfig } from '@morjs/cli'
import { getDate } from './scripts/utils.js'
import { getEnv, getConf } from './scripts/env.js'
import MorJSPluginAssetsReplace from './scripts/plugins/assetsReplace.js'

const { cdnPath, ossDir, assetsSrc, assetsBase, version } = getConf()
const injectEnv = getEnv()

export default defineConfig([
  {
    name: 'alipay',
    sourceType: 'alipay',
    target: 'alipay',
    // compileMode: 'transform',
    // processNodeModules: false,
    // allowSyntheticDefaultImports: false,
    ignore: ['**/assets/**/*'],
    compilerOptions: {
      target: 'ES2017'
    },
    conditionalCompile: {
      context: {
        buildTime: getDate(),
        ...injectEnv
      }
    },
    plugins: [
      new MorJSPluginAssetsReplace({
        cdnPath,
        ossDir,
        assetsSrc,
        assetsBase,
        version
      })
    ]
  },
  {
    name: 'wechat',
    sourceType: 'alipay',
    target: 'wechat',
    // compileMode: 'transform',
    // processNodeModules: false,
    // allowSyntheticDefaultImports: false,
    ignore: ['**/assets/**/*'],
    compilerOptions: {
      target: 'ES2017'
    },
    conditionalCompile: {
      context: {
        buildTime: getDate(),
        ...injectEnv
      }
    },
    plugins: [
      new MorJSPluginAssetsReplace({
        cdnPath,
        ossDir,
        assetsSrc,
        assetsBase,
        version
      })
    ]
  },
  /**
   * 支付宝小程序转 Web 编译配置
   */
  {
    name: 'web',
    sourceType: 'alipay',
    target: 'web',
    globalObject: 'customMy',
    web: {
      showBack: true,
      responsiveRootFontSize: 16,
      // devServer: {
      //   host: 'local-ip',
      //   port: 8888
      // },
      // rpxRootValue: 32,

      // 默认编译出来的样式会以 rem 为单位
      // 优先级高于 needRpx
      // 配合 runtime 层提供的 setRootFontSizeForRem 方法可以实现移动端的响应式。
      // 如果不想将样式单位编译成 rem 可以配置该对象，
      // 对象中包含一个参数 ratio 用于指定 rpx 2 px 的转换比例。
      // 如 ratio 为 1， 那么 1rpx = 1px， 如果配置 ratio 为 2， 那么 1rpx = 0.5px
      usePx: { ratio: 2 },
      htmlOptions: {
        template: './index.html'
      },
      appConfig: {
        apiNoConflict: false,
        components: {
          map: {
            sdk: '', // 地图 sdk 地址
            version: '', // 地图 sdk 版本
            key: '' // 个人地图 key
          }
        }
      }
    }
  }
])
