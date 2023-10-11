# Changelog

All notable changes for major version updates will be documented here.

## 8.2.0

- **Breaking:** function `registerBreadcrumbHelper` no longer takes any config used to define "default" breadcrumbs. All breadcrumbs are no sent to `res.render`.

## 8.0.0

- The error page can now be rendered directly from inside the package. No need to copy and register the Handlebars-file from the app.

## 7.0.0

- The name of the package is changed to @kth/kth-node-web-common
- The package is no longer dependent of deprecated packages.
