import crypto from 'crypto'

/**
 * md5 hash
 * @param {*} filedata
 * @returns
 */
export const md5Hash = (filedata) => {
  return crypto.createHash('md5').update(filedata).digest('hex')
}

/**
 * 路径转正则
 */
const matchOpRegex = /[|\\{}()[\]^$+*?.-]/g
export const escapeReg = (str) => {
  return str.replace(matchOpRegex, '\\$&')
}

/**
 * 日期 20210101121212
 * @returns
 */
export const getDate = () => {
  return new Date()
    .toISOString()
    .replace(/[-:T.]/g, '')
    .slice(0, 14)
}

/**
 * 生成目录 dna 路径
 * @param {*} dir
 * @returns
 * @example
 */
export const dnaDir = (dir, ver, split = '') => {
  const hash = crypto.createHash('md5')
  hash.update(dir)
  hash.update(ver)
  const dna = hash.digest('base64').replace(/=/g, '').slice(0, 6)
  return split ? `${dir}${split}${dna}` : `${dir}${dna}`
}
