const { Controller } = require('egg')
const OSS = require('ali-oss')
// const path = require('node:path');
const moment = require('moment')

class OssController extends Controller {
  async callback() {
    const { ctx } = this

    // 公钥地址
    const pubKeyAddr = Buffer.from(
      ctx.request.headers['x-oss-pub-key-url'],
      'base64',
    ).toString('ascii')
    // 判断
    if (
      !pubKeyAddr.startsWith('https://gosspublic.alicdn.com/') &&
      !pubKeyAddr.startsWith('https://gosspublic.alicdn.com/')
    ) {
      ctx.logger.error('pub key addr must be oss addrss')
      ctx.body = { Status: 'verify not ok' }
      return
    }
    ctx.logger.info('ctx.request.body: ', ctx.request.body)
    ctx.body = { status: 'Ok' }
  }

  async getOssPolicy() {
    const { ctx, app } = this
    const config = app.config.aliOSSConfig
    const client = new OSS(config)

    const date = new Date()
    date.setDate(date.getDate() + 1)
    const policy = {
      expiration: date.toISOString(), // 请求有效期
      conditions: [
        ['content-length-range', 0, 1048576000], // 设置上传文件的大小限制
        // { bucket: client.options.bucket } // 限制可上传的bucket
      ],
    }
    ctx.set({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'PUT,POST,GET',
    })
    // 签名
    const formData = await client.calculatePostSignature(policy)
    // bucket域名
    const host = `http://${config.bucket}.${
      (await client.getBucketLocation()).location
    }.aliyuncs.com`.toString()

    // 回调
    const callback = {
      callbackUrl: config.callbackUrl,
      callbackBody:
        'bucket=${bucket}&object=${object}&filename=${object}&size=${size}&mimeType=${mimeType}&height=${imageInfo.height}&width=${imageInfo.width}&format=${imageInfo.format}&clientIp=${clientIp}',
      callbackBodyType: 'application/x-www-form-urlencoded',
    }

    // 返回参数
    const params = {
      expire: moment().add(1, 'days').unix().toString(),
      policy: formData.policy,
      signature: formData.Signature,
      accessid: formData.OSSAccessKeyId,
      host,
      callback: Buffer.from(JSON.stringify(callback)).toString('base64'),
      dir: config.dir,
    }

    ctx.body = params
  }

  // 获取列表
  async list() {
    const { ctx, app } = this
    const { logger, request, helper } = ctx
    ctx.validate(
      {
        dir: 'string?',
      },
      request.body,
    )
    const config = app.config.aliOSSConfig
    const client = new OSS({
      // yourregion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
      region: config.region,
      // 从环境变量中获取访问凭证。运行本代码示例之前，请确保已设置环境变量OSS_ACCESS_KEY_ID和OSS_ACCESS_KEY_SECRET。
      accessKeyId: config.accessKeyId,
      accessKeySecret: config.accessKeySecret,
      // 填写Bucket名称。
      bucket: config.bucket,
      secure: true,
    })
    logger.info('oss/file/list: ', request.body)
    try {
      // 填写目录名称，目录需以正斜线结尾。
      const result = await client.listV2({
        prefix: request.body.prefix,
        delimiter: '/',
      })
      const body = []
      for await (const item of result?.objects) {
        const url = await client.asyncSignatureUrl(item.name, {
          // default 1800 seconds
          expires: 1800,
          method: 'GET',
        })
        // 跳过本路劲
        if (item.name === helper.appendSlash(request.body.prefix)) {
          continue
        }
        body.push({
          name: item.name,
          type: item.type,
          size: item.size,
          url,
        })
      }
      ctx.body = body
    } catch (e) {
      console.error(e)
      ctx.body = {
        msg: 'error',
      }
    }
  }

  // 创建目录
  async createDir() {
    const { ctx, app } = this
    ctx.validate(
      {
        dir: 'string',
      },
      ctx.request.body,
    )
    const config = app.config.aliOSSConfig
    const client = new OSS({
      // yourregion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
      region: config.region,
      // 从环境变量中获取访问凭证。运行本代码示例之前，请确保已设置环境变量OSS_ACCESS_KEY_ID和OSS_ACCESS_KEY_SECRET。
      accessKeyId: config.accessKeyId,
      accessKeySecret: config.accessKeySecret,
      // 填写Bucket名称。
      bucket: config.bucket,
    })
    try {
      // 填写目录名称，目录需以正斜线结尾。
      const result = await client.put(ctx.request.body.dir, Buffer.from(''))
      console.log(result)
      ctx.body = {
        msg: 'success',
      }
    } catch (e) {
      console.log(e)
      ctx.body = {
        msg: 'error',
      }
    }
  }

  // 删除文件
  async batchDelete() {
    const { ctx, app } = this
    ctx.validate(
      {
        nameList: 'array',
      },
      ctx.request.body,
    )
    const config = app.config.aliOSSConfig
    const client = new OSS({
      region: config.region,
      accessKeyId: config.accessKeyId,
      accessKeySecret: config.accessKeySecret,
      bucket: config.bucket,
    })
    try {
      // 填写Object完整路径。Object完整路径中不能包含Bucket名称。
      const result = await client.deleteMulti(ctx.request.body.nameList, {
        quiet: true,
      })
      ctx.logger.info('delete', result)
      if (result?.res?.status === 200) {
        ctx.body = {
          msg: '删除成功',
        }
      }
    } catch (error) {
      ctx.body = {
        msg: '删除失败',
      }
    }
  }
}

module.exports = OssController
