import { defineConfig } from '@morjs/cli'
import MorJSPluginOSS from './plugins/oss.js'
import { getConf } from './env.js'
const { onlinecdn, cdndir, assetsSrc, assetsBase, version } = getConf()

export default defineConfig([
  {
    plugins: [
      new MorJSPluginOSS({
        onlinecdn,
        cdndir,
        assetsSrc,
        assetsBase,
        version
      })
    ]
  }
])
