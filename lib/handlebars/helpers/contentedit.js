'use strict'

const Handlebars = require('handlebars')
const i18n = require('kth-node-i18n')

/** @function contentedit
 *
 * @param {string} i18nLabel
 * @param {string} editUrl
 * @param {string} lang
 * @param {string} visibility (Optional)
 *
 * @return HTML as safe string (no need to escape)
 *
 * Example
 * {{contentedit 'content_edit_label' '/path/to/edit' sv' 'public'}}
 */
Handlebars.registerHelper('contentedit', function (i18nLabel, editUrl, lang, visibility) {
  if (!i18nLabel) {
    throw new Error('[contentedit] missing first param (i18nLabel): ' + i18nLabel)
  }

  if (!editUrl) {
    throw new Error('[contentedit] missing second param (editUrl): ' + i18nLabel)
  }

  if (!lang) {
    throw new Error('[contentedit] missing third param (lang): ' + i18nLabel)
  }

  if (visibility && typeof visibility !== 'string') {
    if (arguments.length === 4) {
      visibility = undefined
    } else {
      throw new Error('[contentedit] fourth param should be a string (visibility): ' + i18nLabel)
    }
  }

  const visibilityLabel = visibility ? i18n.message('field_label_showing_' + visibility, lang) : ''

  // Render first part of breadcrumb html
  var outp = '<div class="edit-button-and-info">'
  if (visibilityLabel) {
    outp += visibilityLabel + ' | '
  }
  outp += '  <a title="' + visibilityLabel + '" href="' + editUrl + '" class="pencil-icon">'
  outp += i18n.message(i18nLabel, lang)
  outp += '  </a>'
  outp += '</div>'

  return new Handlebars.SafeString(outp)
})
