# @kth/kth-node-web-common

## Header Content Helpers

This is a set of standard helpers that are useful in most [KTH/node-web](https://github.com/KTH/node-web) projects.

### Register Helpers

```javascript
const registerHeaderContentHelper = require('@kth/kth-node-web-common/lib/handlebars/helpers/headerContent')

registerHeaderContentHelper({
  proxyPrefixPath: '/app/mount/point',
  version: 'x.x.x',
})
```

### Use in Handlebars Templates

- {{ extend name options }} -- calls the function options.fn with content of block **name** as param and adds it to named block
- {{ prefixScript url name }} -- add a script tag with version set to script block **name**
- {{ prefixModuleScript url name }} -- add a script tag with type module and with version set to script block **name**
- {{ prefixStyle url name media }} -- add a style tag for named media type with version set to style block **name**
- {{ render name }} -- used by a layout to render script and style blocks in appropriate places
- {{ withVersion url }} -- appends `'?v=' + version` to the passed string

## Breadcrumb Helper

Helper to generate breadcrumb markup.

```javascript
// Import the helper
const { registerBreadcrumbHelper } = require('@kth/kth-node-web-common/lib/handlebars/helpers/breadcrumbs')

// Register the helper
registerBreadcrumbHelper()

// Use the helper in a template
{{breadcrumbs breadcrumbsPath}}

// Add breadcrumbs to res.render
res.render(breadcrumbsPath: [{url: 'https://kth.se', label: 'KTH'}, ...], ...)
```

## Language Link Helper

Handlebars helper to generate a language link in the header. If language can’t be toggled with query parameter `l`, then there is an option to display a dialog with a custom link.

### Register helper

```javascript
// Typically server/views/helpers/index.js

const { registerLanguageLinkHelper } = require('@kth/kth-node-web-common/lib/handlebars/helpers/languageLink')

registerLanguageLinkHelper()
```

### Add language constants

All language constants are optional.

- `language_link_lang_[en/sv]`: Default label for the anchor element's text, if a custom one isn’t provided. Remember that it should be displayed in the opposite language, e.g. if the page is in English the label should be _Svenska_
- `language_link_button_close`: The label for the close button in the dialog element. Only used if there’s a dialog.
- `language_link_not_translated`: The label for the dialog element's text. Only used if there’s a dialog.

```javascript
// Example in i18n/messages.se.js

language_link_lang_en: 'English',
language_link_not_translated: 'Den här sidan är ej översatt',
language_link_button_close: 'Stäng',
```

### Styling

Make sure to include styling from KTH Style.

```css
/* Typically application’s main Sass-file */

@use '~@kth/style/scss/components/translation-panel';
```

### Initialize menu panel

Make sure to initialize the menu panel (dialog). _This might be moved to KTH Style._

```javascript
// Typically in server/views/layouts/publicLayout.handlebars

<script type="module">
  import {MenuPanel} from '{{ proxyPrefix }}/assets/js/index.js' MenuPanel.initTranslationModal(
  document.querySelector(".kth-menu-item.language"), document.querySelector(".kth-translation") )
</script>
```

### Use handlebars helper in head

Include the handlebars helper in the template.

```handlebars
<!-- Typically in server/views/partials/kthHeader.handlebars -->

{{{languageLink lang}}}
```

If no translated page exists, a dialog should be shown on link clink. This can be achieved by passing additional arguments to the helper.

1. The first argument is `lang`, the current language. It is required.
2. The second argument is `anchorMessageKey`, the i18n key for the anchor element's text. Can be omitted (or pass `null`) for default label.
3. The third argument is `link`, the URL to navigate to when the anchor is clicked. If provided, a dialog element is also generated.
4. The fourth argument is `dialogMessageKey`, the i18n key for the dialog element's text. Required if `link` is provided.

```handlebars
<!-- Typically in server/views/partials/kthHeader.handlebars -->

{{{languageLink lang anchorMessageKey link dialogMessageKey}}}
```

Use any variable names, only the argument order matters. Remember that they don’t have to have values. The full signature can be used in the handlebars template, with values only being set in the controller when non-default behavior is needed.

### Common use case

The most common use case is probably that a translated page can be reached by simply adding the query parameter `l`, with a language key like `en`. To achieve this, follow these steps:

1. Include the style from KTH Style, `@use '~@kth/style/scss/components/translation-panel';`
2. Include the handlebars helper in the header partials template, `{{{languageLink lang}}}`
3. Add `language_link_lang_sv: 'Svenska'` and `language_link_lang_en: 'English'` to `messages.en.js` and `messages.sv.js` respectively
4. Verify that `lang` is passed to `render` in the controller.

A link to the opposite language page will now appear in the head.

## Cortina Blocks

Express middleware to fetch Cortina CMS blocks for requests with layouts requiring them:

Uses https://github.com/kth/cortina-block

```JavaScript
route.use('/app/mount/point', require('@kth/kth-node-web-common/lib/web/cortina')({
  blockUrl: 'https://url.to/fetch/block',
  headers: {  // Optional way of passing headers to kth-node-cortina-block request
    'User-Agent': 'something...'
  },
  addBlocks: {  // Optional way of adding Cortina blocks on top of defaults
    menu: '1.678435'
  },
  proxyPrefixPath: '/app/mount/point',
  hostUrl: 'http://server_host:port',
  redisConfig: { ... }, // Optional redis config object, see kth-node-configuration.
  globalLink: true, // Default false if not set, if true the language link point to the startpage of KTH,
  supportedLanguages: ['sv'], // Optional - set to languges supported - if only one language is supported, globalLink sets to true
  siteNameKey = 'site_name', // Defaults to site_name. This key need to be set in i18n messages file
  localeTextKey = 'locale_text', // Defaults to locale_text. This key need to be set in i18n messages file
}))
```

## Crawler Redirect

Middleware to handle redirects for crawlers.

```JavaScript
const excludePath = '/app/mount/point' + '(?!/static).*'
const excludeExpression = new RegExp(excludePath)
server.use(excludeExpression, require('@kth/kth-node-web-common/lib/web/crawlerRedirect')({
  hostUrl: 'http://sertver_host:port',
}))
```

## Language

Middleware and helper methods to set and get language for this request.

Register the middleware:

```JavaScript
const { languageHandler } = require('@kth/kth-node-web-common/lib/language')
sever.use('/app/mount/point', languageHandler)
```

In a controller you can get the language using the helper method **getLanguage**:

```JavaScript
const language = require('@kth/kth-node-web-common/lib/language')
const lang = language.getLanguage(res)

```

## Error Page

There is a helper for rendering error pages with proper styling

To use it, the following must be configured:

- [Register handlebar helpers](#handlebar-helpers)
- [Include error messages](#include-common-error-messages-from-the-package-into-your-application)

Then, import the helper and use as a [final](#use-the-function-from-the-kth-node-web-common-package-in-the-apllication-systemctrljs) method to express

```javascript
const errorHandler = require('kth-node-web-common/lib/error')

// commonly found in systemCtrl.js
function _final(err, req, res, next) {
  errorHandler.renderErrorPage(res, req, statusCode, i18n, isProd, lang, err)
}
```

## Migrate to Version 9

### Handlebar Helpers

The import of the breadcrumb helper has changed. It is now imported as a named import.

```javascript
// Usually found in server/views/helpers/index.js

// Old import
const registerBreadcrumbHelper = require('@kth/kth-node-web-common/lib/handlebars/helpers/breadcrumbs')

// New import
const { registerBreadcrumbHelper } = require('@kth/kth-node-web-common/lib/handlebars/helpers/breadcrumbs')

// Old register helper
registerBreadcrumbHelper({
  proxyPrefixPath: '/app/mount/point',
  version: 'x.x.x',
})

// New register helper
registerBreadcrumbHelper()
```

The function `registerBreadcrumbHelper` no longer takes any config. All breadcrumbs now need to be manually sent to `res.render` on every request.

```javascript
// Generic example of how to use the breadcrumb helper in controllers
const breadcrumbList = [
  { url: 'https://kth.se', label: 'KTH' },
  { url: '/en', label: 'International website' },
]

function index(req, res, next) {
  res.render('index', {
    breadcrumbList,
  })
}
```

## Migrate to Version 8

First, make sure your code is up to date with [Migrate to version 6](#migrate-to-version-6)

The error page can now be rendered directly from inside the package. No need to copy and register the Handlebars-file from the app.

If the app only renders the error page via the `renderErrorPage` helper, you can remove lines like below:

```bash
mkdir -p ./server/views/system ./server/views/layouts

cp ./node_modules/@kth/kth-node-web-common/lib/handlebars/pages/views/ ...

cp ./node_modules/@kth/kth-node-web-common/lib/handlebars/pages/layouts/ ...
```

They are usually located in `build.sh`, or in the scripts section of `package.json`

⚠️ **Warning** it will still be possible to copy the handlebar files to your applications, but they will no longer be updated, and will probalby be removed in the future. ⚠️

## Migrate to Version 6

Here is a small migration guide if your application is build from the node-web template.

Please note when using version 7, the package name must be changed to @kth/kth-node-web-common.

### Include common error messages from the package into your application

In your application, add the following into your `i18n/index.js`

```JavaScript
// Include error messages from kth-node-web-common package
const errorMessagesEnglish = require('kth-node-web-common/lib/i18n/errorMessages.en')
const errorMessagesSwedish = require('kth-node-web-common/lib/i18n/errorMessages.sv')

// Include application messasges
const messagesEnglish = require('./messages.en')
const messagesSwedish = require('./messages.se')

// Add the error messages to the application defined messages before pushing them.
messagesSwedish.messages = { ...messagesSwedish.messages, ...errorMessagesSwedish.messages }
messagesEnglish.messages = { ...messagesEnglish.messages, ...errorMessagesEnglish.messages }

```

### Use the function from the `kth-node-web-common` package in the apllication systemCtrl.js

Do the following changes in your `/server/controller/systemCtrl.js`

1. Include the error handler

```javascript
const errorHandler = require('kth-node-web-common/lib/error')
```

2. Remove the `\_getFriendlyErrorMessage` method.
3. In the `\_final` method, add the following code after the declaration of `lang` variable:

```javascript
// Use error pages from kth-node-web-common based on given parameters.
errorHandler.renderErrorPage(res, req, statusCode, i18n, isProd, lang, err)
```

3. Remove the switch and `res.format` code.
4. Remove unused error labels the messages files `/i18n/messages.en.js` and `/i18n/messages.sv.js`
