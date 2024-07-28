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
    // // 后续中间件执行完成后，将响应体转换成 gzip
    // let body = ctx.body;
    // if (!body) return;
    //
    // // 支持 options.threshold
    // if (options.threshold && ctx.length < options.threshold) return;
    //
    // if (isJSON(body)) body = JSON.stringify(body);
    //
    // // 设置 gzip body，修正响应头
    // const stream = zlib.createGzip();
    // stream.end(body);
    // ctx.body = stream;
    // ctx.set('Content-Encoding', 'gzip');
  }
}
