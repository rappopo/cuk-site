'use strict'

module.exports = function(cuk) {
  const { _, helper } = cuk.pkg.core.lib
  const cfg = cuk.pkg.site.cfg.common

  return () => {
    return async (ctx, next) => {
      ctx.state.reqId = helper('core:makeId')()
      let hostname = ctx.request.hostname
      if (hostname.substr(0, 4) === 'www.')
        hostname = hostname.substr(4)

      ctx.state.site.domain = hostname
      let skin = cuk.pkg[ctx.state.site.skin]
      if (skin) {
        let themes = skin.cfg.common.themes || []
        if (themes.length > 0 && themes.indexOf(ctx.state.site.theme) === -1)
          ctx.state.site.theme = skin.cfg.common.defaultTheme || themes[0]
      }
      return next()
    }
  }
}