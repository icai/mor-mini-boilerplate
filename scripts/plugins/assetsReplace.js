import { md5File, filePathReplace, pushFile, searchFiles } from '../upload.js'
import { watch } from 'gulp'
import path from 'node:path'

export default class MorJSPluginAssetsReplace {
  constructor(opts) {
    this.opts = opts || {}
    this.name = 'MorJSPluginAssetsReplace'
  }
  getModulePath(filePath, compiler) {
    return path.isAbsolute(filePath) ? filePath : path.join(compiler.context, filePath)
  }
  async updateDepsComplier(mpath, compiler) {
    // scan the dependency path in the compiler
    const filePaths = await searchFiles(
      {
        assetsBase,
        assetsSrc
      },
      mpath
    )
    // update the dependency file's mtime
    filePaths.forEach((filePath) => {
      let fileWatchers = compiler.watchFileSystem.watcher.fileWatchers
      const resolveFilePath = path.resolve(filePath)
      const modulePath = this.getModulePath(resolveFilePath, compiler)
      const time = new Date().getTime()
      fileWatchers.forEach((fileWatcher, filePath) => {
        const fileWatcherPath = fileWatcher.path || fileWatcher.watcher.path
        if (modulePath === fileWatcherPath) {
          const fileWatcherDirectoryWatcher = fileWatcher.directoryWatcher || fileWatcher.watcher.directoryWatcher
          fileWatcherDirectoryWatcher.setFileTime(resolveFilePath, time, false, false, 'change')
        }
      })
    })
  }
  apply(runner) {
    const { cdnPath, ossDir, assetsSrc, assetsBase, version } = this.opts
    let pathmap = {}
    let osspathmap = {}
    const hashFile = (path) => {
      ;[pathmap, osspathmap] = md5File({
        src: path || assetsSrc,
        base: assetsBase,
        cdnPath
      })
    }
    let _compiler

    runner.hooks.beforeRun.tap(this.name, (command) => {
      hashFile()
      // watch file
      if (runner.commandOptions.watch) {
        const watcher = watch(assetsSrc, { delay: 1000 })
        // watcher listen change and add event
        ;['add', 'change'].forEach((type) => {
          watcher.on(type, async (path, _stats) => {
            hashFile()
            await this.updateDepsComplier(path, _compiler)
            pushFile({
              src: path,
              base: assetsBase,
              osspathmap,
              ossDir,
              version
            })
          })
        })
      }
    })

    runner.hooks.compiler.tap(this.name, (compiler) => {
      _compiler = compiler
    })

    runner.hooks.preprocessorParser.tap(this.name, (fileContent, context, options) => {
      if (!/(\.(js|axml|wxml|acss|wxss|scss|less))|app\.json$/.test(options.fileInfo.path)) return fileContent
      // 对 js axml wxml ... app.json 文件进行一些前置处理
      return filePathReplace(fileContent, pathmap)
    })
  }
}
