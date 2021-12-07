'use strict'

/*
 * Middleware for redirecting crawler requests to the canonical url.
 *
 * Canonical url is current url without query string
 *
 * When to redirect
 * User-Agent contains 'kth-gsa-crawler', i.e. a crawler request
 * Accept does NOT contain 'application/json', i.e. skip ajax-calls
 * path does NOT match '/<proxyPrefixPath>/static', i.e. skip resources
 */

const log = require('kth-node-log')
const url = require('url')

module.exports = function crawlerRedirect(options) {
  const { hostUrl } = options // config.hostUrl

  function isCrawlerRequest(req) {
    const gsaUserAgent = 'kth-gsa-crawler'
    const currentUserAgent = req.get('User-Agent')

    if (currentUserAgent && currentUserAgent.toLowerCase().indexOf(gsaUserAgent) >= 0) {
      return true
    }

    return false
  }

  function getCanonicalUrl(aUrl) {
    const tmpUrl = url.parse(aUrl)
    tmpUrl.search = ''
    let canonicalUrl = tmpUrl.format()
    if (canonicalUrl.endsWith('/')) {
      canonicalUrl = canonicalUrl.substr(0, canonicalUrl.length - 1)
    }

    return canonicalUrl
  }

  function shouldRedirectToCanonicalUrl(req, currentUrl, canonicalUrl) {
    return isCrawlerRequest(req) && currentUrl !== canonicalUrl
  }

  function redirectToCanonicalUrl(req, res, next) {
    const contentType = req.get('Accept')
    if (!contentType || contentType.indexOf('application/json') >= 0) {
      next()
      return
    }

    // We should really be setting `X-Forwarded-Host` header field and use req.hostname /jhsware
    const currentUrl = hostUrl + res.req.originalUrl
    const canonicalUrl = getCanonicalUrl(currentUrl)

    if (isCrawlerRequest(res.req) && shouldRedirectToCanonicalUrl(res.req, currentUrl, canonicalUrl)) {
      log.debug('Redirecting crawler ', req.get('User-Agent'), contentType, res.req.originalUrl)
      res.redirect(301, canonicalUrl)
      return
    }

    next()
  }

  return redirectToCanonicalUrl
}
