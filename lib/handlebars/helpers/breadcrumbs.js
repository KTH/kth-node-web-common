// @ts-check

const Handlebars = require('handlebars')
const log = require('@kth/log')

/**
 * @param {{url: string, label: string}[]} pathList
 * @param {string} lang
 *
 * @returns {string} HTML as string
 *
 */
function getBreadcrumbsMarkup(pathList, lang) {
  /**
   * list of anchor tags
   * @type {string[]}
   */
  const listItems = []

  pathList.forEach(({ url, label }) => {
    listItems.push(`<a href="${url}">${label}</a>`)
  })

  const ariaLabel = /^sv/.test(lang) ? 'Brödsmulor' : 'Breadcrumbs'

  const output = `
  <nav id="breadcrumbs" aria-label="${ariaLabel}" class="col-12 col-md-9">
    <ol class="breadcrumb">
      ${listItems.map(item => `<li class="breadcrumb-item">${item}</li>`)}
    </ol>
  </nav>
`
  return output
}

/**
 * @param {{url: string, label: string}[]} pathList
 * @param {string} lang, e.g. "en"
 *
 * @returns {Handlebars.SafeString|null} HTML as safe string (no need to escape)
 *
 * Example
 * {{breadcrumbs pathList lang}}
 */
function breadcrumbs(pathList, lang) {
  const pathListIsValid =
    Array.isArray(pathList) &&
    pathList.every(
      item => typeof item.label === 'string' && item.label !== '' && typeof item.url === 'string' && item.url !== ''
    )
  if (!pathListIsValid) {
    log.warn('[breadcrumbs] helper requires first parameter to be a list of path item objects')
    return null
  }
  const output = getBreadcrumbsMarkup(pathList, lang)
  return new Handlebars.SafeString(output)
}

function registerBreadcrumbHelper() {
  Handlebars.registerHelper('breadcrumbs', breadcrumbs)
}

module.exports = {
  registerBreadcrumbHelper,
  breadcrumbs,
  getBreadcrumbsMarkup,
}
