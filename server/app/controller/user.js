const { Controller } = require('egg')
const crypto = require('node:crypto')

class UserController extends Controller {
  login() {
    const { ctx, app } = this
    ctx.logger.info(ctx.request.body)

    const keyObject = crypto.createPrivateKey({
      key: app.config.privateKey,
      type: 'pkcs1',
      format: 'pem',
      // padding 默认值就是 crypto.constants.RSA_PKCS1_OAEP_PADDING
      // padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    })

    const decryptedBuf = crypto.privateDecrypt(
      keyObject,
      Buffer.from(ctx.request.body.password, 'base64'),
    )

    ctx.logger.info(decryptedBuf.toString())

    ctx.body = {
      status: 'Ok',
    }
  }
}

module.exports = UserController
