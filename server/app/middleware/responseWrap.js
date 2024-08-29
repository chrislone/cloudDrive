// app/middleware/responseWrap.js
// const isJSON = require('koa-is-json');

module.exports = (options = {}) => {
  return async function responseWrap(ctx, next) {
    await next()

    ctx.logger.info('ctx.status: ', ctx.status)
    if (ctx.status === 200) {
      ctx.body = {
        code: ctx.status,
        data: ctx.body,
        msg: '操作成功',
        errorList: [],
        traceId: ctx.traceId,
      }
    }
  }
}
