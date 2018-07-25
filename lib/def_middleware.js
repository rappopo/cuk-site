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

      try {
        const sites = await helper('model:find')('site:profile', {
          domain: hostname
        })
        if (sites.data.length === 0) return next()  // todo: redirect to site not found
        const site = sites.data[0]
        ctx.state.site.domain = hostname
        let skin = cuk.pkg[site.skin]
        if (skin) {
          ctx.state.site.skin = site.skin
          let themes = _.get(skin, 'cfg.common.themes', [])
          if (themes.length > 0) {
            if (themes.indexOf(site.theme) > -1)
              ctx.state.site.theme = site.theme
            else
              ctx.state.site.theme = _.get(skin, 'cfg.common.defaultTheme', themes[0])
          }
        }
      } catch(e) {
      }
      return next()
    }
  }
}