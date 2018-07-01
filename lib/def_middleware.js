'use strict'

module.exports = function(cuk) {
  const { _, helper } = cuk.lib
  const cfg = cuk.pkg.site.cfg.common

  return () => {
    return async (ctx, next) => {
      ctx.state.reqId = helper('core:makeId')()
      let hostname = ctx.request.hostname
      if (hostname.substr(0, 4) === 'www.')
        hostname = hostname.substr(4)

      ctx.state.site = {
        hostname: hostname,
        skin: cfg.skin,
        theme: cfg.theme
      }

      let skin = cuk.pkg[ctx.state.site.skin]
      if (skin) {
        let themes = skin.cfg.common.themes || []
        if (themes.length === 0) {
          ctx.state.site.theme = null
        } else if (themes.indexOf(ctx.state.site.theme) === -1) {
          ctx.state.site.theme = skin.cfg.common.defaultTheme || themes[0]
        }
      } else {
        ctx.state.site.skin = 'view'
        ctx.state.site.theme = null
      }
      return next()
    }
  }
}