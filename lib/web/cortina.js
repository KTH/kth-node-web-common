'use strict'

/*
 * Middleware for loading Cortina blocks.
 *
 * This will set the property blocks on the ExpressJS request.
 * It is required for any view that uses the KTH header and footer partials.
 *
 * The blocks are not loaded for static routes.
 * There’s also a query parameter, 'nocortinablocks', to request that no blocks should be loaded.
 */

const log = require('@kth/log')
const cortina = require('@kth/cortina-block')
const redis = require('kth-node-redis')
const i18n = require('kth-node-i18n')
const language = require('../language')

module.exports = function cortinaCommon(options) {
  const cortinaBlockUrl = options.blockUrl // config.blockApi.blockUrl
  const {
    headers,
    addBlocks,
    proxyPrefixPath,
    hostUrl,
    redisConfig,
    redisKey,
    siteNameKey = 'site_name',
    localeTextKey = 'locale_text',
  } = options
  let { supportedLanguages = ['sv', 'en'] } = options
  if (!supportedLanguages.length) supportedLanguages = ['sv', 'en']
  const globalLink = supportedLanguages.length === 1 ? true : options.globalLink || false

  function _getRedisClient() {
    return redis('cortina', redisConfig)
  }

  function _prepareBlocks(req, res, blocks) {
    let lang = language.getLanguage(res)
    if (!supportedLanguages.includes(lang)) [lang] = supportedLanguages
    return cortina.prepare(blocks, {
      // if you don't want/need custom site name or locale text,
      // simply comment out the appropriate lines of code

      // this sets the site name shown in the header
      siteName: i18n.message(siteNameKey, lang),

      // this needs to be set to the "opposite" of the current language
      localeText: i18n.message(localeTextKey, lang === 'en' ? 'sv' : 'en'),

      urls: {
        // baseUrl is the location where the router was mounted. This solves a particular problem with
        // publications-web and could lead to problems in other apps. Beware...
        request: req.baseUrl + req.url,
        app: hostUrl + proxyPrefixPath,
      },
      // If true, the language link will point to KTH start page instead of the current page.
      globalLink,
    })
  }

  function _getCortinaBlocks(client, req, res, next) {
    let lang = language.getLanguage(res)
    if (!supportedLanguages.includes(lang)) [lang] = supportedLanguages
    return cortina({
      language: lang,
      url: cortinaBlockUrl,
      headers,
      redis: client,
      blocks: addBlocks,
      redisKey,
    })
      .then(blocks => {
        res.locals.blocks = _prepareBlocks(req, res, blocks)
        log.debug('Cortina blocks loaded.')
        next()
      })
      .catch(err => {
        log.error('Cortina failed to load blocks: ' + err.message)
        res.locals.blocks = {}
        next()
      })
  }

  function _cortina(req, res, next) {
    // don't load cortina blocks for static content, or if query parameter 'nocortinablocks' is present
    if (/^\/static\/.*/.test(req.url) || req.query.nocortinablocks !== undefined) {
      next()
      return
    }
    if (redisConfig === undefined) {
      _getCortinaBlocks(null, req, res, next)
      return
    }

    _getRedisClient()
      .then(client => _getCortinaBlocks(client, req, res, next))
      .catch(err => {
        log.error('Failed to create Redis client: ' + err.message)
        return _getCortinaBlocks(null, req, res, next)
      })
  }

  return _cortina
}
