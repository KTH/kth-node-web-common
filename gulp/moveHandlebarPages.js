const gulp = require('gulp')
const mergeStream = require('merge-stream')

module.exports = function () {
  const errorView = gulp.src([
    './node_modules/kth-node-web-common/lib/handlebars/pages/views/*'
  ]).pipe(gulp.dest('server/views/system'))

  const errorLayout = gulp.src([
    './node_modules/kth-node-web-common/lib/handlebars/pages/layouts/*'
  ]).pipe(gulp.dest('server/views/layouts'))

  return mergeStream(errorView, errorLayout)
}
