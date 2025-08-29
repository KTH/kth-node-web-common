# Changelog

All notable changes for major version updates will be documented here.

## 10.0.0

### Removed

- Helper contentedit. Often imported in `server/views/helpers/index.js`.
- Helper safe. Often imported in `server/views/helpers/index.js`.
- Helper toJSON.

## 9.6.1

Add deprecation warning for safe handlebar helper

## 9.6.0

### Changed

- 404 error page no longer logs a full stacktrace

## 9.5.1

Add deprecation warning for cortinaBlock wrapper

## 9.2.0

Cortina helper accepts a new parameter `useStyle10` that serves blocks tailored to the new version of KTH-Style.  
If the parameter is false or missing, blocks tailored for KTH-Style 9 will be fetched.

## 9.0.0

- **Breaking:** function `registerBreadcrumbHelper` no longer takes any config. All breadcrumbs now need to be manually sent to `res.render` on **every request**.
- **Breaking:** import changed to `const {registerBreadcrumbHelper} = require('@kth/kth-node-web-common/lib/handlebars/helpers/breadcrumbs')`

## 8.0.0

- The error page can now be rendered directly from inside the package. No need to copy and register the Handlebars-file from the app.

## 7.0.0

- The name of the package is changed to @kth/kth-node-web-common
- The package is no longer dependent of deprecated packages.
