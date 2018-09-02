'use strict'

module.exports = function (cuk) {
  const { helper } = cuk.pkg.core.lib
  const defMiddleware = require('./lib/def_middleware')(cuk)()

  const app = cuk.pkg.http.lib.app

  return new Promise((resolve, reject) => {
    app.use(helper('http:composeMiddleware')(defMiddleware, 'Site info & skinning support'))
    resolve(true)
  })
}
