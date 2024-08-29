/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller, middlewares } = app
  router.get('/', middlewares.checkPermission(), controller.home.index)
  // router.get('/oss/getOssPolicy', controller.oss.getOssPolicy);
  router.post('/api/oss/callback', controller.oss.callback)
  router.post('/api/oss/file/list', controller.oss.list)
  router.post('/api/oss/dir/create', controller.oss.createDir)
  router.post('/api/oss/file/batchDelete', controller.oss.batchDelete)

  router.post('/api/user/login', controller.user.login)
}
