# Changelog

All notable changes for major version updates will be documented here.

## 9.0.0

- **Breaking:** function `registerBreadcrumbHelper` no longer takes any config used to define "default" breadcrumbs. All breadcrumbs are now sent to `res.render`.
- **Breaking:** are changed, import with `const {registerBreadcrumbHelper} = require('@kth/kth-node-web-common/lib/handlebars/helpers/breadcrumbs')`

## 8.0.0

- The error page can now be rendered directly from inside the package. No need to copy and register the Handlebars-file from the app.

## 7.0.0

- The name of the package is changed to @kth/kth-node-web-common
- The package is no longer dependent of deprecated packages.
