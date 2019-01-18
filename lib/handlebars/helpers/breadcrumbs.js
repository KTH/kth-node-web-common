'use strict'

const Handlebars = require('handlebars')
const log = require('kth-node-log')
const i18n = require('kth-node-i18n')
/** @function breadcrumbs
 *
 * @param {array} pathList -- {url: '', label: ''}
 * @param {string} lang
 *
 * @return HTML as safe string (no need to escape)
 *
 * Example
 * {{breadcrumbs pathList lang}}
 */
module.exports = function (host, hostNameKey, basePath, baseNameKey) {
  Handlebars.registerHelper('breadcrumbs', function (pathList, lang) {
    if (!Array.isArray(pathList)) {
      throw new Error('[breadcrumbs] helper requires first parameter to be a list of path item objects')
    }

    var hostUrl = host ? host.replace('https://', '//').replace('http://', '//') : 'https://www.kth.se'

    // Render first part of breadcrumb html
    var outp = '<nav id="breadcrumbs" class=“col-12 col-md-9”>'
    outp += '<ol aria-label="Brödsmulor - navigation uppåt i innehållsstrukturen" class="breadcrumb">'
    if (host && hostNameKey) {
      outp += '    <li class="breadcrumb-item"><a href="' + hostUrl + '">' + i18n.message(hostNameKey, lang) + '</a></li>'
    } else {
      log.warn('Breadcrumbs helper did not get hostName or hostNameKey, defaulting to www.kth.se and KTH')
      outp += '    <li class="breadcrumb-item"><a href="' + hostUrl + '">KTH</a></li>'
    }

    if (basePath) {
      outp += '    <li class="breadcrumb-item"><a href="' + hostUrl + basePath + '">' + i18n.message(baseNameKey, lang) + '</a></li>'
    }

    // Render breadcrumb entries passed in pathList
    outp += pathList.map((item) => {
      var tmp = ''
      if (item.url) {
        // Match protocol in url with protocol of page
        var tmpUrl = item.url.replace('https://', '//').replace('http://', '//')
        tmp += '    <li class="breadcrumb-item"><a href="' + tmpUrl + '">' + item.label + '</a></li>'
      } else {
        tmp += '    <li class="breadcrumb-item"><span class="breadcrumbLabel">' + item.label + '</span></li>'
      }
      return tmp
    }).join('\n')

    outp += '</ol>'
    // Close breadcrumb html elements
    outp += '</nav>'

    return new Handlebars.SafeString(outp)
  })
}
