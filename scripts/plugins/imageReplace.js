import { md5Image, filePathReplace, pushImage } from '../upload.js'
import { getConf } from '../env.js'
import { watch } from 'gulp'
const { onlinecdn, cdndir, imageSrc, imageBase, version } = getConf()

export default class MorJSPluginImageReplace {
  constructor() {
    this.name = 'MorJSPluginImageReplace'
  }
  apply(runner) {
    let paths = []
    let pathmap = {}
    let osspathmap = {}
    const hashImage = () => {
      ;[paths, pathmap, osspathmap] = md5Image({
        src: imageSrc,
        base: imageBase,
        onlinecdn
      })
    }
    runner.hooks.beforeRun.tap(this.name, (command) => {
      hashImage()
    })
    // watch image file
    watch(imageSrc, { delay: 1000 }, (cb) => {
      hashImage()
      pushImage({
        src: imageSrc,
        base: imageBase,
        osspathmap,
        cdndir,
        version
      })
      cb()
    })
    runner.hooks.preprocessorParser.tap(this.name, (fileContent, context, options) => {
      if (!/(\.(js|axml|acss))|app\.json$/.test(options.fileInfo.path)) return fileContent
      // 对 js axml acss app.json 文件进行一些前置处理
      return filePathReplace(fileContent, paths, pathmap)
    })
  }
}
