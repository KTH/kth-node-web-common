/*
 * Middleware for loading Cortina blocks.
 *
 * This will set the property blocks on the ExpressJS request.
 * It is required for any view that uses the KTH header and footer partials.
 *
 * The blocks are not loaded for static routes.
 * There’s also a query parameter, 'nocortinablocks', to request that no blocks should be loaded.
 */
import { NextFunction, Request, Response } from 'express'
import log from '@kth/log'
import cortina, { prepare } from '@kth/cortina-block'
import redis from 'kth-node-redis'
import i18n from 'kth-node-i18n'
import { type SupportedLanguage } from '../language'
import language from '../language'

type Options = {
  blockUrl: string
  headers: Headers
  addBlocks: any
  proxyPrefixPath: string
  hostUrl: string
  redisConfig: any
  redisKey: string
  supportedLanguages: SupportedLanguage[]
  globalLink: boolean
}

export default function cortinaCommon(options: Options) {
  const cortinaBlockUrl = options.blockUrl // config.blockApi.blockUrl
  const {
    headers,
    addBlocks,
    proxyPrefixPath,
    hostUrl,
    redisConfig,
    redisKey,
    supportedLanguages = ['sv', 'en'],
  } = options
  const globalLink = supportedLanguages.length === 1 ? true : options.globalLink || false

  function _getRedisClient() {
    return redis('cortina', redisConfig)
  }

  function _prepareBlocks(req: Request, res: Response, blocks) {
    const lang = language.getLanguage(res)
    return prepare(blocks, {
      // if you don't want/need custom site name or locale text,
      // simply comment out the appropriate lines of code

      // this sets the site name shown in the header
      siteName: i18n.message('site_name', lang),

      // this needs to be set to the "opposite" of the current language
      localeText: i18n.message('locale_text', lang === 'en' ? 'sv' : 'en'),

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

  function _getCortinaBlocks(req: Request, res: Response, next: NextFunction, client?: any) {
    const lang = language.getLanguage(res)
    const config = {
      language: lang,
      url: cortinaBlockUrl,
      headers,
      redis: client,
      blocks: addBlocks,
      redisKey,
    }
    return cortina(config)
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

  function _cortina(req: Request, res: Response, next: NextFunction) {
    // don't load cortina blocks for static content, or if query parameter 'nocortinablocks' is present
    if (/^\/static\/.*/.test(req.url) || req.query.nocortinablocks !== undefined) {
      return next()
    }

    _getRedisClient()
      .then(client => _getCortinaBlocks(req, res, next, client))
      .catch(err => {
        log.error('Failed to create Redis client: ' + err.message)
        return _getCortinaBlocks(req, res, next)
      })
  }

  return _cortina
}
