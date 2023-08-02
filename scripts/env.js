import dotenv from 'dotenv'
import fs from 'fs'

// .env.local
// .env.development *
// .env

let defenv = {}
if (fs.existsSync('.env')) {
  defenv = dotenv.config()
}

let env = process.env.NODE_ENV || 'development'
let envPath = `.env.${env}`
let curenv = {}
if (fs.existsSync(envPath)) {
  curenv = dotenv.config({
    path: envPath
  })
}
let localEnv = {}
if (fs.existsSync('.env.local')) {
  localEnv = dotenv.config({
    path: '.env.local'
  })
}

// merge env
let injectEnv = {
  ...defenv?.parsed,
  ...curenv?.parsed,
  ...localEnv?.parsed
}

/**
 * 环境配置
 * @returns Object
 */
export const getEnv = () => {
  return injectEnv
}

/**
 * 获取项目配置
 * @returns Object
 */
export const getConf = () => {
  // cdn 目录 一般为 项目名/版本号
  let cdndir = process.env.cdnUploadPath
  // oss 域名
  let cdn = process.env.cdnUpload
  // cdn 域名
  let onlinecdn = process.env.cdnRoot + cdndir
  cdn = cdn + cdndir
  return {
    onlinecdn,
    cdn,
    cdndir,
    version: '1_0_0', // 版本号
    imageSrc: './src/images/**/*',
    imageBase: './src/'
  }
}
