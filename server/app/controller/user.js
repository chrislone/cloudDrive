const Controller = require('../core/baseController')
const { createPrivateKey, privateDecrypt } = require('node:crypto')
const ms = require('ms')

class UserController extends Controller {
  async login() {
    const { ctx, app } = this
    ctx.logger.info(ctx.request.body)

    const { u, p } = ctx.request.body
    const { privateKey, authUsers } = app.config

    const userInfoItem = authUsers.find((item) => {
      return item.username === u
    })

    if (!userInfoItem) {
      this.fail(401, {
        msg: 'user not found or password incorrect',
      })
      return
    }

    const keyObject = createPrivateKey({
      key: privateKey,
      type: 'pkcs1',
      format: 'pem',
      // padding 默认值就是 crypto.constants.RSA_PAKC1_OAEP_PADDING
      // padding: crypto.constants.RSA_PAKC1_OAEP_PADDING,
    })

    let decryptedBuf = Buffer.from('')
    let verifyResult = false

    try {
      decryptedBuf = privateDecrypt(keyObject, Buffer.from(p, 'base64'))
      verifyResult = userInfoItem.password === decryptedBuf.toString()
    } catch (e) {
      this.fail(401, {
        msg: 'user not found or password incorrect',
      })
      return
    }

    this.logger.info('verifyResult: ', verifyResult)
    if (!verifyResult) {
      this.fail(401, {
        msg: 'user not found or password incorrect',
      })
      return
    }

    this.user = {
      u,
      et: Date.now() + ms('1h'),
    }

    this.success()
  }
}

module.exports = UserController
