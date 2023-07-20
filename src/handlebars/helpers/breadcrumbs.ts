import Handlebars from 'handlebars'
import log from '@kth/log'
import i18n from 'kth-node-i18n'

/**
 * Register
 *
 * @param {string} host URL of homepage, e.g. "https://www.kth.se"
 * @param {string} hostNameKey caption of homepage-link, e.g. "KTH"
 * @param {string} basePath URL of section, e.g. "https://www.kth.se/utbildning"
 * @param {string} baseNameKey caption of section-link, e.g. "Utbildning"
 */
export default function registerBreadcrumbHelper(
  host: string,
  hostNameKey: string,
  basePath: string,
  baseNameKey: string
) {
  /**
   * @param {object[]} pathList with items { url: '...', label: '...' } or { label: '...' }
   * @param {string} lang, e.g. "en"
   *
   * @returns {Handlebars.SafeString|null} HTML as safe string (no need to escape)
   *
   * Example
   * {{breadcrumbs pathList lang}}
   */
  function breadcrumbs(pathList: { url: string; label: string }[], lang: string) {
    const pathListIsValid =
      Array.isArray(pathList) &&
      pathList.every(
        item => item != null && typeof item === 'object' && typeof item.label === 'string' && item.label !== ''
      )
    if (!pathListIsValid) {
      log.warn('[breadcrumbs] helper requires first parameter to be a list of path item objects')
      return null
    }

    const protocolOfPage = host ? new URL(host).protocol : ''
    const hostUrl = host ? host.replace(/^https?:\/\//, `${protocolOfPage}//`) : 'https://www.kth.se'

    if (!host || !hostNameKey) {
      log.warn('Breadcrumbs helper did not get hostName and hostNameKey, defaulting to www.kth.se and KTH')
    }

    const listItems: string[] = []

    const captionHost = host && hostNameKey ? i18n.message(hostNameKey, lang) : 'KTH'
    listItems.push(`<a href="${hostUrl}">${captionHost}</a>`)

    if (basePath) {
      const captionBase = i18n.message(baseNameKey, lang)
      listItems.push(`<a href="${hostUrl}${basePath}">${captionBase}</a>`)
    }

    pathList.forEach(item => {
      if (typeof item.url === 'string' && item.url !== '') {
        const _url = item.url.replace(/^https?:\/\//, `${protocolOfPage}//`)
        listItems.push(`<a href="${_url}">${item.label}</a>`)
      }
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
