// app/middleware/responseWrap.js
// const isJSON = require('koa-is-json');

module.exports = (options = {}) => {
  return async function responseWrap(ctx, next) {
    await next();
    ctx.set('Access-Control-Allow-Origin', '*')
    ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT')
  };
};
