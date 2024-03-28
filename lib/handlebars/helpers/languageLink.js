const Handlebars = require('handlebars')
const i18n = require('kth-node-i18n')

const VALID_LANGUAGES = ['sv', 'en']
const VALID_LOCALE = { sv: 'sv-SE', en: 'en-US' }

function resolveTranslationLanguage(lang) {
  if (!VALID_LANGUAGES.includes(lang)) {
    throw new Error(`[languageLink] helper requires first parameter to be a string matching a language, i.e. 'sv'.`)
  }
  return VALID_LANGUAGES[1 - VALID_LANGUAGES.indexOf(lang)]
}

function resolveDefaultLabel(lang) {
  const translationLang = resolveTranslationLanguage(lang)
  return i18n.message(`label_lang_${translationLang}`, lang)
}

function anchorElement(lang, anchorMessageKey, link) {
  const label = typeof anchorMessageKey === 'string' ? i18n.message(anchorMessageKey, lang) : resolveDefaultLabel(lang)

  const hreflang = VALID_LOCALE[resolveTranslationLanguage(lang)]
  const output = `<a class="kth-menu-item language" hreflang="${hreflang}" href="${link}">${label}</a>`
  return output
}

function dialogElement(lang, link, dialogMessageKey) {
  const output = `
    <dialog class="kth-translation">
      <div class="kth-translation__content">
        <button class="kth-icon-button close">
          <span class="kth-visually-hidden">${i18n.message('label_button_close', lang)}</span>
        </button>
        <span>${i18n.message('label_not_translated', lang)}</span>
        <a href="${link}">${i18n.message(dialogMessageKey, lang)}</a>
      </div>
  </dialog>`
  return output
}

/**
 * Generates a language link and an optional dialog element for language selection.
 *
 * Used i18n keys:
 * - `label_lang_[sv/en]` - Default label for the anchor element's text, if a custom one isn’t provided.
 * - `label_button_close` - The label for the close button in the dialog element.
 * - `label_not_translated` - The label for the dialog element's text.
 *
 * @param {string} lang - The current language.
 * @param {string} [anchorMessageKey] - The i18n key for the anchor element's text. Can be omitted for default label.
 * @param {string} [link] - The URL to navigate to when the anchor is clicked. If provided, a dialog element is also generated.
 * @param {string} [dialogMessageKey] - The i18n key for the dialog element's text. Required if `link` is provided.
 *
 * @returns {string} The generated HTML string containing the language link and optional dialog element.
 *
 * @throws {Error} If `lang` is not a valid language or if `link` is provided but `dialogMessageKey` is not.
 */
function languageLink(lang, anchorMessageKey, link, dialogMessageKey) {
  // Custom link is missing, use a query parameter to change language
  if (typeof link !== 'string') {
    return anchorElement(lang, anchorMessageKey, `?l=${resolveTranslationLanguage(lang)}`)
  }

  // Link is provided, but dialog information is incomplete
  if (typeof dialogMessageKey !== 'string') {
    throw new Error(`[languageLink] helper requires a fourth parameter, if a third is provided.`)
  }

  // Link is provided, use custom link and dialog
  return `${anchorElement(lang, anchorMessageKey, '')}${dialogElement(lang, link, dialogMessageKey)}`
}

function registerLanguageLinkHelper() {
  Handlebars.registerHelper('languageLink', languageLink)
}

module.exports = {
  registerLanguageLinkHelper,
  languageLink, // Exported for testing
}
