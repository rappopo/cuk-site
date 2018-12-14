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
        if (sites.data.length === 0) return next() // todo: redirect to site not found
        const site = sites.data[0]
        ctx.state.site = site
        let skin = cuk.pkg[site.skin]
        if (skin) {
          ctx.state.site.skin = site.skin
          let themes = _.get(skin, 'cfg.themes', [])
          if (themes.length > 0) {
            let theme = _.find(themes, { id: site.theme })
            if (theme) ctx.state.site.theme = site.theme
            else ctx.state.site.theme = _.get(skin, 'cfg.defaultTheme', themes[0].id)
          }
        }
      } catch (e) {
      }
      return next()
    }
  }
}
