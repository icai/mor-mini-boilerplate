import globby from 'globby'
import fs from 'fs'
import { md5Hash, escapeReg } from './utils.js'
import { src } from 'gulp'
import ossSync from 'gulp-oss-sync'

/**
 * 转换图片CDN md5 路径
 */
export const convertCdnUrl = (item, md5Str, rootDir) => {
  let str =
    rootDir +
    item
      .replace(/^\/images\//, '')
      .replace(/(\/|\\|\-)/g, '_')
      .replace(/\.(png|jpg|jpeg|gif|webp|mp4)$/, `_${md5Str}.$1`)
  return str
}

/**
 * 图片md5
 */
export const md5Image = (options) => {
  // 图片数组
  let paths = []
  // 图片路径映射
  let pathmap = {}
  let osspathmap = {}
  paths = globby.sync([options.src], {
    cwd: './'
  })
  let srcproject = options.base
  paths = paths.map((item) => item.replace(srcproject, '/'))
  paths.forEach((item) => {
    let filedata = fs.readFileSync(srcproject + item)
    let md5 = md5Hash(filedata)
    let newPath = convertCdnUrl(item, md5, '')
    pathmap[item] = options.onlinecdn + '/' + newPath
    osspathmap[item] = newPath
  })
  return [paths, pathmap, osspathmap]
}

/**
 * 图片路径替换
 */
export const filePathReplace = (content, paths, pathmap) => {
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
export const pushImage = (options) => {
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
      dir: options.cdndir,
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
