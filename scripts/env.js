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
  // oss 域名
  let ossRoot = process.env.ossRoot
  // ossDir 目录 一般为 项目名/版本号
  let ossDir = process.env.ossUploadPath
  // oss 上传路径
  let ossPath = ossRoot + ossDir
  // cdn 域名
  let cdnRoot = process.env.cdnRoot
  // if cdn domain is array
  cdnRoot = cdnRoot.split(',')
  // cdn 路径 loop cdnRoot
  let cdnPath = cdnRoot.map((item) => item + ossDir)
  return {
    ossRoot,
    ossDir,
    ossPath,
    cdnRoot,
    cdnPath, // array
    version: '1_0_0', // 版本号
    assetsSrc: './src/assets/**/*',
    assetsBase: './src/'
  }
}
