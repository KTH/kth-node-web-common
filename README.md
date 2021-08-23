## Handlebar Helpers

This is a set of standard helpers needed in most KTH node-web projects.

Register helpers:

```JavaScript
const registerHeaderContentHelper = require('kth-node-web-common/lib/handlebars/helpers/headerContent')

registerHeaderContentHelper({
  proxyPrefixPath: '/app/mount/point',
  version: 'x.x.x'
})
```

Usage in templates:

- {{ withVersion url }} -- appends `'?v=' + version` to the passed string
- {{ extend name options }} -- calls the function options.fn with content of block **name** as param and adds it to named block
- {{ prefixScript url name }} -- add a script tag with version set to script block **name**
- {{ prefixStyle url name media }} -- add a style tag for named media type with version set to style block **name**
- {{ render name }} -- used by a layout to render script and style blocks in appropriate places

## Cortina Blocks

Express middleware to fetch Cortina CMS blocks for requests with layouts requiring them:

Uses https://github.com/KTH/kth-node-cortina-block

```JavaScript
route.use('/app/mount/point', require('kth-node-web-common/lib/web/cortina')({
  blockUrl: 'https://url.to/fetch/block',
  headers: {  // Optional way of passing headers to kth-node-cortina-block request
    'User-Agent': 'something...'
  },
  addBlocks: {  // Optional way of adding Cortina blocks on top of defaults
    menu: '1.678435'
  },
  proxyPrefixPath: '/app/mount/point',
  hostUrl: 'http://server_host:port',
  redisConfig: { ... }, // Redis config object, see kth-node-configuration
  globalLink: true // Default false if not set, if true the language link point to the startpage of KTH
}))
```

## Crawler Redirect

Middleware to handle redirects for crawlers.

```JavaScript
const excludePath = '/app/mount/point' + '(?!/static).*'
const excludeExpression = new RegExp(excludePath)
server.use(excludeExpression, require('kth-node-web-common/lib/web/crawlerRedirect')({
  hostUrl: 'http://sertver_host:port',
}))
```

## Language

Middleware and helper methods to set and get language for this request.

Register the middleware:

```JavaScript
const { languageHandler } = require('kth-node-web-common/lib/language')
sever.use('/app/mount/point', languageHandler)
```

In a controller you can get the language using the helper method **getLanguage**:

```JavaScript
const language = require('kth-node-web-common/lib/language')
const lang = language.getLanguage(res)

```

## Views

In lib/handlebars/pages you will find common handlebar pages that can be used in your node app.

### Error

Error page for 404 or 500. It is recommended to use shell script to coy the files like the examples below.
Note this package no longer provdes gulp tasks to copy the files.

Example in package.json script:

```JavaScript
"scripts": {
  "build": "NODE_ENV=production npm run move-handlebar-pages && rm -rf dist && npm run app && npm run vendor",
   ...
 "move-handlebar-pages": "cp ./node_modules/kth-node-web-common/lib/handlebars/pages/views/error.handlebars ./server/views/system/error.handlebars && cp ./node_modules/kth-node-web-common/lib/handlebars/pages/layouts/errorLayout.handlebars ./server/views/layouts/errorLayout.handlebars"
```

Alternative way if using dedicated build script:

```
# Ensure  target folder structure
echo -e "     -> Creating the server/view folder structure"
mkdir -p ./server/views/system ./server/views/layouts

# Copy error.handlebars page to this project
echo -e "     -> Copying error.handlebars to server/views/system folder"
cp ./node_modules/kth-node-web-common/lib/handlebars/pages/views/error.handlebars server/views/system

# Copy errorLayout.handlebars layout to this project
echo -e "     -> Copying errorLayout.handlebars to server/views/layouts folder"
cp ./node_modules/kth-node-web-common/lib/handlebars/pages/layouts/errorLayout.handlebars server/views/layouts

```

Remember to add the files to your .gitignore, they should not be pushed to your repo since they are added on build.

```
# KTH Node Web Common imported files
server/views/system/error.handlebars
server/views/layouts/errorLayout.handlebars
```

# Changes in version 6

Here is a small migration guide if your application is build from the node-web template.

## Include common error messages from the package into your application

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

## Use the function from the `kth-node-web-common` package in the apllication systemCtrl.js

Do the following changes in your `/server/controller/systemCtrl.js`

1. Include the error handler

```JavaScript
const errorHandler = require('kth-node-web-common/lib/error')
```

2. Remove the `\_getFriendlyErrorMessage` method.
3. In the `\_final` method, add the following code after the declaration of `lang` variable:

```JavaScript
// Use error pages from kth-node-web-common based on given parameters.
errorHandler.renderErrorPage(res, req, statusCode, i18n, isProd, lang, err)
```

3. Remove the switch and `res.format` code.
