gulp       = require "gulp"
plumber    = require "gulp-plumber"
notify     = require "gulp-notify"
bs         = require "browser-sync"
coffee     = require "gulp-coffee"
concat     = require "gulp-concat"

entryFile = "./src/coffee/main.coffee"

name =
  js: "app.js"

dist =
  js: "./app/js/"
  css: "./app/css/"

order = [
  entryFile
  # "./src/coffee/namespace.coffee"
  # "./src/coffee/base/*.coffee"
  "./src/coffee/model.coffee"
  # "./src/coffee/collection/*.coffee"
  "./src/coffee/view.coffee"
  # "./src/coffee/controller/*.coffee"
]

# concatが不要ならconcatの行をコメントアウトする
gulp.task "coffee", ->
  gulp.src order
    .pipe plumber
      errorHandler: notify.onError "<%= error.message %>"
    .pipe concat name.js
    .pipe coffee bare: false
    .pipe gulp.dest dist.js

# ローカルサーバとcoffeeの自動コンパイル
gulp.task "default", ->
  bs.init
    server:
      baseDir: ["app"]
      directory: false
      index: "index.html"
    notify: false
    host: "localhost"

  gulp.watch ["app/index.html"], bs.reload
  gulp.watch ["src/coffee/**/*.coffee"], ["coffee", bs.reload]

gulp.task "watch", ["default"]
