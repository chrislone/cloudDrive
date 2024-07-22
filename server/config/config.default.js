/* eslint valid-jsdoc: "off" */
const assert = require('node:assert')
let globalConfig = {}

try {
  globalConfig = require('../../config')
} catch (e) {
  console.error(e)
}

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {
    security: {
      csrf: {
        enable: false,
      },
    },
    onerror: {
      all(err, ctx) {
        // 定义所有响应类型的错误处理方法
        // 定义了 config.all 后，其他错误处理不再生效
        ctx.helper.errorsHandler(err)
      },
    },
  })

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_20240722_2200'

  // add your middleware config here
  config.middleware = ['responseWrap']

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
