import { md5File, pushFile } from '../upload.js'
const COMMAND_NAME = 'oss'

export default class MorJSPluginOSS {
  constructor(opts) {
    this.opts = opts || {}
    this.name = 'MorJSPluginOSS'
  }
  apply(runner) {
    const { onlinecdn, cdndir, assetsSrc, assetsBase, version } = this.opts
    // 可通过该 hook 拿到一个 cli 的实例
    runner.hooks.cli.tap(this.name, (cli) => {
      // 通过 cli.command 新建一个命令行指令
      // 注册 options 选项
      // command.option(rawName, '选项描述');
      // eg: 创建一个名为 gogogo 的命令行指令，并添加 --prod 选项配置
      // cli.command('gogogo', 'gogog 命令行').option('--prod', '开启生产模式')
      // 那么在终端可运行 mor gogogo 或 mor gogogo --prod 命令行指令
      const command = cli.command(COMMAND_NAME, 'upload to oss')
      command.action((args, options, logger) => {
        // 命令行指令的执行逻辑
        let [paths, pathmap, osspathmap] = md5File({
          src: assetsSrc,
          base: assetsBase,
          onlinecdn
        })
        pushFile({
          src: assetsSrc,
          base: assetsBase,
          osspathmap,
          cdndir,
          version
        })
      })
    })
  }
}
