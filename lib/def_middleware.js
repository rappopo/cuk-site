'use strict'

module.exports = function (cuk) {
  const { _, helper } = cuk.pkg.core.lib
  return () => {
    return async (ctx, next) => {
      let hostname = ctx.request.hostname
      if (hostname.substr(0, 4) === 'www.') hostname = hostname.substr(4)

      try {
        const sites = await helper('model:find')('site:profile', {
          domain: hostname
        })
        if (sites.data.length === 0) throw helper('core:makeError')('Site not found')
        const site = sites.data[0]
        if (!site.active) throw helper('core:makeError')('Site is inactive/disabled')
        ctx.state.site = site
        let skin = cuk.pkg[site.skin]
        if (skin) {
          ctx.state.site.skin = site.skin
          let themes = helper('core:config')(site.skin, 'themes', [])
          if (themes.length > 0) {
            let theme = _.find(themes, { id: site.theme })
            if (theme) ctx.state.site.theme = site.theme
            else ctx.state.site.theme = helper('core:config')(site.skin, 'defaultTheme', themes[0].id)
          }
        }
      } catch (e) {
        throw e
      }
      return next()
    }
  }
}
