const ms = require('ms')
const msTime = ms('1h')

module.exports = (options = {}) => {
  return async function checkPermission(ctx, next) {
    const { logger } = ctx
    logger.info('ctx.session', ctx.session)

    const { u, et } = ctx.session.user

    if (et) {
      const minus = et - Date.now()
      if (minus > msTime) {
        ctx.throw(401, '登录信息校验不通过')
      }
    } else if (!u) {
      ctx.throw(401, '请先登录')
    }
    await next()
  }
}
