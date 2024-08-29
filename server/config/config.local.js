/* eslint valid-jsdoc: "off" */
const assert = require('node:assert')
let developmentConfig = {}
let globalConfig = {}

try {
  developmentConfig = require('../../config.development')
  globalConfig = require('../../config')
  Object.assign(globalConfig, developmentConfig)
} catch (e) {
  console.error(e)
}

assert(globalConfig.aliOSSConfig, '需要在 config.js 中配置 aliOSSConfig')

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {})

  // add your middleware config here
  config.middleware = ['cors']

  // 阿里 OSS 配置
  const aliOSSConfig = globalConfig.aliOSSConfig || {
    accessKeyId: '',
    accessKeySecret: '',
    bucket: '',
    region: '',
    callbackUrl: '',
  }

  return {
    ...config,
    aliOSSConfig,
  }
}
