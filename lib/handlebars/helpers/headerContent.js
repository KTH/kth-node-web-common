/* eslint-disable prefer-arrow-callback */

'use strict'

const Handlebars = require('handlebars')

/** @function headerContent
 *
 * @param {options} { proxyPrefixPath: '', version: ''}
 *
 * @return Registers some satandard helpers
 *
 * @example
 * require('kth-node-web-common/lib/handlebars/helpers/headerContent')({ proxyPrefixPath: '', version: ''})
 */
module.exports = function headerContent(options) {
  const proxyPrefixPathUri = options.proxyPrefixPath || ''
  const version = options.version || 'version not set'

  /** @function withVersion
   *
   * @param {string} url -- url without query params
   *
   * @return outputs url with version appended '?v=1.0.1'
   *
   * @example
   * {{withVersion '/path/to/script.js'}}
   */
  Handlebars.registerHelper('withVersion', function withVersion(url) {
    // Check params and give useful error message since stack traces aren't very useable in layouts
    if (typeof url !== 'string') {
      throw new Error('[withVersion] helper requires first parameter to be a string. Got: ' + url)
    }
    return url + '?v=' + version
  })

  Handlebars.registerHelper('withProxyPrefixPath', function withProxyPrefixPath(url) {
    // Check params and give useful error message since stack traces aren't very useable in layouts
    if (typeof url !== 'string') {
      throw new Error('[withProxyPrefixPath] helper requires first parameter to be a string. Got: ' + url)
    }
    return proxyPrefixPathUri + url
  })

  const _blocks = {}

  /** @function extend
   *
   * @param {string} name -- name of block
   * @param {object} options -- options object: { fn: function () {...} }
   *
   * @return outputs url with version appended '?v=1.0.1'
   *
   * @example
   * {{withVersion '/path/to/script.js'}}
   */
  Handlebars.registerHelper('extend', function extend(name, opt) {
    // Check params and give useful error message since stack traces aren't very useable in layouts
    if (typeof name !== 'string') {
      throw new Error('[extend] helper requires first parameter to be a string. Got: ' + name)
    }
    _blocks[name] = _blocks[name] || []
    _blocks[name].push(opt.fn({ _blocks }))
  })

  /** @function prefixScript
   *
   * @param {string} url -- local path to script excluding proxyPrefixPath
   * @param {string} blockName -- (optional) name of script block to include with, defaults to 'scripts'
   *
   * @return output with {{ render blockName }}
   *
   * @example
   * {{prefixScript '/path/to/script.js' 'scripts'}}
   */
  Handlebars.registerHelper('prefixScript', function prefixScript(urlIn, blockNameIn) {
    // Check params and give useful error message since stack traces aren't very useable in layouts
    if (typeof urlIn !== 'string') {
      throw new Error('[prefixScript] helper requires first parameter (url) to be a string. Got: ' + urlIn)
    }

    const blockName = typeof blockNameIn === 'string' ? blockNameIn : 'scripts'
    _blocks[blockName] = _blocks[blockName] || []

    const url = `${proxyPrefixPathUri}${urlIn}?v=${encodeURIComponent(version)}`

    _blocks[blockName].push(`<script src="${url}"></script>`)
  })

  /** @function prefixStyle
   *
   * @param {string} url -- local path to script excluding proxyPrefixPath
   * @param {string} blockName -- (optional) name of style block to include with, defaults to 'styles'
   * @param {string} media -- (optional) media type, defaults to 'all'
   *
   * @return output with {{ render blockName }}
   *
   * @example
   * {{prefixStyle '/path/to/style.css' 'styles' 'all'}}
   */
  Handlebars.registerHelper('prefixStyle', function prefixStyle(urlIn, blockNameIn, mediaIn) {
    // Check params and give useful error message since stack traces aren't very useable in layouts
    if (typeof urlIn !== 'string') {
      throw new Error('[prefixScript] helper requires first parameter (url) to be a string. Got: ' + urlIn)
    }

    const blockName = typeof blockNameIn === 'string' ? blockNameIn : 'styles'
    const media = typeof mediaIn === 'string' ? mediaIn : 'all'

    _blocks[blockName] = _blocks[blockName] || []

    const url = `${proxyPrefixPathUri}${urlIn}?v=${encodeURIComponent(version)}`

    _blocks[blockName].push(`<link href="${url}" media="${media}" rel="stylesheet">`)
  })

  /** @function prefixStyle
   *
   * @param {string} name -- name of block to render
   *
   * @return html
   *
   * @example
   * {{render 'scripts'}}
   */
  Handlebars.registerHelper('render', function render(name) {
    // Check params and give useful error message since stack traces aren't very useable in layouts
    if (typeof name !== 'string') {
      throw new Error('[safe] helper requires first parameter to be a string. Got: ' + name)
    }

    const content = _blocks[name] || []
    delete _blocks[name]
    return new Handlebars.SafeString(content.join('\n'))
  })
}
