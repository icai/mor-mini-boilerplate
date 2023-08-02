import { defineConfig } from '@morjs/cli'
import MorJSPluginOSS from './plugins/oss.js'

export default defineConfig([
  {
    plugins: [new MorJSPluginOSS()]
  }
])
