import { md5File, filePathReplace, pushFile } from '../upload.js'
import { watch } from 'gulp'
export default class MorJSPluginAssetsReplace {
  constructor(opts) {
    this.opts = opts || {}
    this.name = 'MorJSPluginAssetsReplace'
  }
  apply(runner) {
    const { onlinecdn, cdndir, assetsSrc, assetsBase, version } = this.opts
    let paths = []
    let pathmap = {}
    let osspathmap = {}
    const hashFile = () => {
      ;[paths, pathmap, osspathmap] = md5File({
        src: assetsSrc,
        base: assetsBase,
        onlinecdn
      })
    }
    runner.hooks.beforeRun.tap(this.name, (command) => {
      hashFile()
      // watch file
      if (runner.commandOptions.watch) {
        watch(assetsSrc, { delay: 1000 }, (cb) => {
          hashFile()
          pushFile({
            src: assetsSrc,
            base: assetsBase,
            osspathmap,
            cdndir,
            version
          })
          cb()
        })
      }
    })

    runner.hooks.preprocessorParser.tap(this.name, (fileContent, context, options) => {
      if (!/(\.(js|axml|wxml|acss|wxss|scss|less))|app\.json$/.test(options.fileInfo.path)) return fileContent
      // 对 js axml wxml ... app.json 文件进行一些前置处理
      return filePathReplace(fileContent, paths, pathmap)
    })
  }
}
