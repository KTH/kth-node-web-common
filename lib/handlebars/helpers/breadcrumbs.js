// @ts-check

const Handlebars = require('handlebars')
const log = require('@kth/log')

module.exports = function registerBreadcrumbHelper() {
  /**
   * @param {{url: string, label: string}} pathList
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

    /**
     * list of anchor tags
     * @type {string[]}
     */
    const listItems = []

    pathList.forEach(({ url, label }) => {
      listItems.push(`<a href="${url}">${label}</a>`)
    })

    const ariaLabel = /^sv/.test(lang) ? 'Brödsmulor' : 'Breadcrumbs'

    const output =
      '\n' +
      `    <nav id="breadcrumbs" aria-label="${ariaLabel}" class="col-12 col-md-9">\n` +
      '      <ol class="breadcrumb">\n' +
      listItems.map(item => `        <li class="breadcrumb-item">${item}</li>\n`).join('') +
      '      </ol>\n' +
      '    </nav>\n'

    return new Handlebars.SafeString(output)
  }

  Handlebars.registerHelper('breadcrumbs', breadcrumbs)
}
