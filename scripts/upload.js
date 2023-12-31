import globby from 'globby'
import fs from 'fs'
import { md5Hash, escapeReg } from './utils.js'
import { src } from 'gulp'
import ossSync from 'gulp-oss-sync'

/**
 * 转换文件CDN md5 路径
 */
export const convertCdnUrl = (item, md5Str, rootDir) => {
  let str =
    rootDir +
    item
      .replace(/^\/assets\//, '')
      .replace(/(\/|\\|\-)/g, '_')
      .replace(/\.(png|jpg|jpeg|gif|webp|html|mp4)$/, `_${md5Str}.$1`)
  return str
}

/**
 * 搜索依赖文件路径
 */
export const searchFiles = async (options, targetString) => {
  targetString = targetString.replace(/^src/g, '')
  const filePaths = globby.sync([options.assetsBase + '**/*'], {
    base: options.assetsBase,
    ignoreFiles: [options.assetsSrc]
  })
  let paths = []
  for (const filePath of filePaths) {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8')
      if (fileContent.includes(targetString)) {
        // console.log('Found in:', filePath)
        paths.push(filePath)
      }
    } catch (err) {
      console.error('Error reading file:', err)
    }
  }
  return paths
}

/**
 * 文件md5
 */
export const md5File = (options) => {
  // 图片数组
  let paths = []
  // 图片路径映射
  let pathmap = {}
  let osspathmap = {}
  paths = globby.sync([options.src], {
    base: options.base
  })
  let srcproject = options.base
  paths = paths.map((item) => item.replace(srcproject, '/'))
  if (options.cdnPath.length === 1) {
    options.cdnPath = options.cdnPath[0]
    paths.forEach((item) => {
      let filedata = fs.readFileSync(srcproject + item)
      let md5 = md5Hash(filedata)
      let newPath = convertCdnUrl(item, md5, '')
      pathmap[item] = options.cdnPath + '/' + newPath
      osspathmap[item] = newPath
    })
  } else {
    paths.forEach((item) => {
      let filedata = fs.readFileSync(srcproject + item)
      let md5 = md5Hash(filedata)
      let newPath = convertCdnUrl(item, md5, '')
      let cdnPathIndex = parseInt(md5.slice(-6), 16) % options.cdnPath.length
      pathmap[item] = options.cdnPath[cdnPathIndex] + '/' + newPath
      osspathmap[item] = newPath
    })
  }
  return [pathmap, osspathmap]
}

/**
 * 图片路径替换
 */
export const filePathReplace = (content, pathmap) => {
  const paths = Object.keys(pathmap)
  paths.forEach((item) => {
    content = content.replace(new RegExp(escapeReg(item), 'g'), pathmap[item])
  })
  return content
}

/**
 * 图片推送
 * @param {*} options
 * @returns
 */
export const pushFile = (options) => {
  const ossConf = {
    connect: {
      region: process.env.region,
      accessKeyId: process.env.accessKeyId,
      accessKeySecret: process.env.accessKeySecret,
      bucket: process.env.bucket
    },
    controls: {
      // month: max-age=2628000
      headers: {
        'Cache-Control': 'max-age=2628000, public'
      }
    },
    setting: {
      // root directory name
      dir: options.ossDir,
      // compare with the last cache file to decide if the file deletion is need
      noClean: true,
      force: false, // ignore cache file and force re-upload all the files
      quiet: true, // quiet option for oss deleteMulti operation
      fileName: (str) => {
        return options.osspathmap['/' + str]
      }
    }
  }
  const cacheConf = {
    cacheFileName: `.oss-cache/${options.version}` // the filename for the cache file
  }
  return src(options.src, {
    base: options.base
  }).pipe(ossSync(ossConf, cacheConf))
}
