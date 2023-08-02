import { md5Image, pushImage } from '../upload.js'
import { getConf } from '../env.js'
const { onlinecdn, cdndir, imageSrc, imageBase, version } = getConf()

const COMMAND_NAME = 'oss'

export default class MorJSPluginOSS {
  constructor() {
    this.name = 'MorJSPluginOSS'
  }
  apply(runner) {
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
        let [paths, pathmap, osspathmap] = md5Image({
          src: imageSrc,
          base: imageBase,
          onlinecdn
        })
        pushImage({
          src: imageSrc,
          base: imageBase,
          osspathmap,
          cdndir,
          version
        })
      })
    })
  }
}
