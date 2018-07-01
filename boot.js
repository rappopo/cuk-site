'use strict'

module.exports = function(cuk){
  let id = 'site',
    pkg = cuk.pkg[id],
    cfg = pkg.cfg.common
  const { _, debug, helper, path, fs } = cuk.lib
  const defMiddleware = require('./lib/def_middleware')(cuk)()

  const app = cuk.pkg.http.lib.app

  return new Promise((resolve, reject) => {
    app.use(helper('http:composeMiddleware')(defMiddleware, 'Site info & skinning support'))
    resolve(true)
  })
}