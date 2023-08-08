import { defineConfig } from '@morjs/cli'
import MorJSPluginOSS from './plugins/oss.js'
import { getConf } from './env.js'
const { cdnPath, ossDir, assetsSrc, assetsBase, version } = getConf()

export default defineConfig([
  {
    plugins: [
      new MorJSPluginOSS({
        cdnPath,
        ossDir,
        assetsSrc,
        assetsBase,
        version
      })
    ]
  }
])
