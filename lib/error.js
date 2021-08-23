'use strict'

const log = require('kth-node-log')

/**
 *
 */
function _errorHandler(res, req, statusCode, i18n, isProd, lang, err) {
  let headTitle
  let headDescription
  let title
  let text
  let text1
  let text2
  let linkText1
  let link1
  let linkText2
  let link2
  let linkText3
  let link3

  switch (statusCode) {
    case 400:
      log.info({ err }, `400 Bad request ${err.message}`)
      headTitle = i18n.message('error_400_head_title', lang)
      headDescription = i18n.message('error_400_description', lang)
      title = i18n.message('error_400_description', lang)
      text = i18n.message('error_400_text', lang)
      break
    case 401:
      log.info({ err }, `401 Unauthorized ${err.message}`)
      headTitle = i18n.message('error_401_head_title', lang)
      headDescription = i18n.message('error_401_description', lang)
      title = i18n.message('error_401_description', lang)
      text = i18n.message('error_401_text', lang)
      break
    case 403:
      log.info({ err }, `403 Forbidden ${err.message}`)
      headTitle = i18n.message('error_403_head_title', lang)
      headDescription = i18n.message('error_403_description', lang)
      title = i18n.message('error_403_description', lang)
      text = i18n.message('error_403_text', lang)
      break
    case 404:
      log.info({ err }, `404 Not found ${err.message}`)
      headTitle = i18n.message('error_404_head_title', lang)
      headDescription = i18n.message('error_404_description', lang)
      title = i18n.message('error_404_description', lang)
      text1 = i18n.message('error_404_text_1', lang)
      text2 = i18n.message('error_404_text_2', lang)
      linkText1 = i18n.message('error_404_link_text_1', lang)
      link1 = i18n.message('error_404_link_1', lang)
      linkText2 = i18n.message('error_404_link_text_2', lang)
      link2 = i18n.message('error_404_link_2', lang)
      linkText3 = i18n.message('error_404_link_text_3', lang)
      link3 = i18n.message('error_404_link_3', lang)
      break
    default:
      log.error({ err }, `Unhandled error ${err.message}`)
      headTitle = i18n.message('error_500_head_title', lang)
      headDescription = i18n.message('error_500_description', lang)
      title = i18n.message('error_500_description', lang)
      text = i18n.message('error_500_text', lang)
  }

  res.format({
    'text/html': () => {
      res.status(statusCode).render('system/error', {
        layout: 'errorLayout',
        statusCode,
        headTitle,
        headDescription,
        title,
        text,
        text1,
        text2,
        linkText1,
        link1,
        linkText2,
        link2,
        linkText3,
        link3,
        message: err.message,
        // friendly: _getFriendlyErrorMessage(lang, statusCode),
        error: isProd ? {} : err,
        status: statusCode,
        statusCodeLabel: i18n.message('error_status_code', lang),
        debug: 'debug' in req.query,
      })
    },

    'application/json': () => {
      res.status(statusCode).json({
        message: err.message,
        // friendly: _getFriendlyErrorMessage(lang, statusCode),
        error: isProd ? undefined : err.stack,
      })
    },

    default: () => {
      res
        .status(statusCode)
        .type('text')
        .send(isProd ? err.message : err.stack)
    },
  })
}

module.exports = {
  errorHandler: _errorHandler,
}
