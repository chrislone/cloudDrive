const { Controller } = require('egg')

class BaseController extends Controller {
  get user() {
    return this.ctx.session.user
  }

  set user(val) {
    this.ctx.session.user = val
  }

  success(data = null, message = '', code = 200) {
    this.ctx.body = {
      code,
      msg: message || '操作成功',
      data,
      traceId: this.ctx.traceId,
    }
  }

  fail(statusCode = 400, body = {}) {
    const { ctx } = this
    if (arguments.length === 2) {
      body = Object.assign(
        {
          msg: '发生错误',
          data: null,
          code: 400,
        },
        body,
        {
          code: statusCode,
        },
      )
      ctx.status = statusCode
    } else if (arguments.length === 1) {
      switch (typeof arguments[0]) {
        case 'object': {
          body = Object.assign(
            {
              msg: '发生错误',
              data: null,
              code: 400,
            },
            statusCode,
          )
          ctx.status = body.code
          break
        }
        case 'number': {
          body = Object.assign(
            {
              msg: '发生错误',
              data: null,
              code: 400,
            },
            {
              code: statusCode,
            },
          )
          ctx.status = statusCode
          break
        }
        default: {
          break
        }
      }
    }
  }
}

module.exports = BaseController
