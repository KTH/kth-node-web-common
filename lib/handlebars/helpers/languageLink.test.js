const handlebars = require('handlebars')

const mockTranslations = {
  en: {
    language_link_lang_sv: 'Svenska',
    label_custom: 'Custom',
    label_locale_select_link_title: 'Visa översättning',
    language_link_button_close: 'Close',
    language_link_not_translated: 'Den här sidan är inte översatt',
    label_start_page: 'Startsida på svenska',
  },
  sv: {
    language_link_lang_en: 'English',
    label_custom: 'Anpassad',
    label_locale_select_link_title: 'Show translation',
    language_link_button_close: 'Stäng',
    language_link_not_translated: 'This page is not translated',
    label_start_page: 'Start page in English',
  },
}

jest.mock('kth-node-i18n', () => ({
  message: (key, lang) => mockTranslations[lang][key],
}))

const { registerLanguageLinkHelper, languageLink } = require('./languageLink')

jest.mock('handlebars')

describe('registerLanguageLinkHelper', () => {
  it('registers language link helper', () => {
    registerLanguageLinkHelper()
    expect(handlebars.registerHelper).toHaveBeenCalledWith('languageLink', languageLink)
  })
})

describe('languageLink', () => {
  it('throws an error if lang parameter is missing', () => {
    expect(() => languageLink()).toThrow(
      new Error(`[languageLink] helper requires first parameter to be a string matching a language, i.e. 'sv'.`)
    )
  })

  it('throws an error if link is provided, but not dialogMessageKey', () => {
    const lang = 'en'
    expect(() => languageLink(lang, '', 'https://kth.se')).toThrow(
      new Error(`[languageLink] helper requires a fourth parameter, if a third is provided.`)
    )
  })

  it('should return link with query parameter and default to opposite language label (en -> sv)', () => {
    const lang = 'en'
    const result = languageLink(lang)
    expect(result).toMatchSnapshot()
  })

  it('should return link with query parameter and default to opposite language label (sv -> en)', () => {
    const lang = 'sv'
    const result = languageLink(lang)
    expect(result).toMatchSnapshot()
  })

  it('should return link with query parameter and anchorMessageKey in opposite language (en -> sv)', () => {
    const lang = 'en'
    const anchorMessageKey = 'label_custom'
    const result = languageLink(lang, anchorMessageKey)
    expect(result).toMatchSnapshot()
  })

  it('should return link with query parameter and anchorMessageKey in opposite language (sv -> en)', () => {
    const lang = 'sv'
    const anchorMessageKey = 'label_custom'
    const result = languageLink(lang, anchorMessageKey)
    expect(result).toMatchSnapshot()
  })

  it('should return dialog with custom link and default to opposite language label (en -> sv)', () => {
    const lang = 'en'
    const link = 'https://kth.se/sv'
    const dialogMessageKey = 'label_start_page'
    const result = languageLink(lang, null, link, dialogMessageKey)
    expect(result).toMatchSnapshot()
  })

  it('should return dialog with custom link and default to opposite language label (sv -> en)', () => {
    const lang = 'sv'
    const link = 'https://kth.se/en'
    const dialogMessageKey = 'label_start_page'
    const result = languageLink(lang, null, link, dialogMessageKey)
    expect(result).toMatchSnapshot()
  })
})
