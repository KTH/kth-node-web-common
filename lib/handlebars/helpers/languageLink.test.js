const handlebars = require('handlebars')

const mockTranslations = {
  label_lang_en_sv: 'English',
  label_lang_en_en: 'Engelska',
  label_lang_sv_sv: 'Swedish',
  label_lang_sv_en: 'Svenska',
  label_custom_sv: 'Anpassad',
  label_custom_en: 'Custom',
  label_locale_select_link_title_sv: 'Show translation',
  label_locale_select_link_title_en: 'Visa översättning',
  label_button_close_sv: 'Stäng',
  label_button_close_en: 'Close',
  label_not_translated_en: 'Den här sidan är inte översatt',
  label_not_translated_sv: 'This page is not translated',
  label_start_page_sv: 'Start page in English',
  label_start_page_en: 'Startsida på svenska',
}

jest.mock('kth-node-i18n', () => ({
  message: (key, lang) => mockTranslations[`${key}_${lang}`],
}))

const { registerLanguageLinkHelper, languageLink } = require('./languageLink')

jest.mock('handlebars')
jest.mock()

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
