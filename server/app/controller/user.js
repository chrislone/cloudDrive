const { Controller } = require('egg')
const {
  createPrivateKey,
  privateDecrypt,
  createSign,
  createVerify,
} = require('node:crypto')

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
      ctx.status = 403
      ctx.body = {
        msg: 'user not exist or password incorrect',
      }
      return
    }

    const sign = createSign('SHA256')
    sign.update(p)
    sign.end()
    const signature = sign.sign(privateKey)

    const verify = createVerify('SHA256')
    verify.update(userInfoItem.password)
    verify.end()

    const verifyResult = verify.verify(privateKey, signature)

    this.logger.info('verifyResult: ', verifyResult)
    if (!verifyResult) {
      ctx.status = 403
      ctx.body = {
        msg: 'user not exist or password incorrect',
      }
      return
    }

    ctx.body = {
      msg: 'Ok',
    }
  }
}

module.exports = UserController
