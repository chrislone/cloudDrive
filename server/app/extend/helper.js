const { SnowflakeId } = require('@akashrajpurohit/snowflake-id')

module.exports = {
  generateId() {
    // this 是 helper 对象，在其中可以调用其他 helper 方法
    // this.ctx => context 对象
    // this.app => application 对象
    const snowflake = SnowflakeId({
      workerId: process.pid % 1024,
      epoch: Date.now(),
    })

    return snowflake.generate()
  },
  errorHandle422(error) {
    const { ctx } = this

    ctx.body = JSON.stringify({
      code: 422,
      msg: '操作成功',
      errorList: error.errors,
      traceId: ctx.traceId,
    })
  },
  errorHandle4xx(error) {
    const { ctx } = this
    let errList = []
    if (Array.isArray(error.errors)) {
      errList = error.errList
    } else {
      errList = [
        {
          message: error.message,
          code: error.code,
        },
      ]
    }
    ctx.body = JSON.stringify({
      code: 400,
      msg: '操作成功',
      errorList: errList,
      traceId: ctx.traceId,
    })
  },
  errorHandle5xx(error) {
    let errList = []
    const { ctx } = this
    if (Array.isArray(error.errors)) {
      errList = error.errList
    } else {
      errList = [
        {
          message: error.message,
          code: error.code,
        },
      ]
    }
    ctx.body = JSON.stringify({
      code: 500,
      msg: '操作成功',
      errorList: errList,
      traceId: ctx.traceId,
    })
  },
  errorsHandler(error) {
    const { ctx } = this
    const { status } = ctx
    ctx.set('content-type', 'application/json')
    if (status >= 400 && status < 500) {
      // 特殊处理 422
      if (status === 422) {
        this.errorHandle422(error)
      } else {
        this.errorHandle4xx(error)
      }
    } else if (status >= 500 && status < 600) {
      this.errorHandle5xx(error)
    }
  },
  // 在路径之后增加斜杠 /
  appendSlash(path) {
    const reg = /\/$/
    if (!path) {
      return ''
    }
    if (!reg.test(path)) {
      return path + '/'
    }
    return path
  },
}
