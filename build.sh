#!/bin/bash

set -e

npm ci

npx tsc

mkdir dist/handlebars/pages
mkdir dist/handlebars/pages/layouts
mkdir dist/handlebars/pages/views

cp -r ./src/handlebars/pages/layouts/*.handlebars ./dist/handlebars/pages/layouts
cp -r ./src/handlebars/pages/views/*.handlebars ./dist/handlebars/pages/views
