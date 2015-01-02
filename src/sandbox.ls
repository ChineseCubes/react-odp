$       = require 'jquery'
#Storage = require './Logic/Storage'

module.exports = !->
  console.log navigator.epubReadingSystem
  $ document .keyup (e) -> console.log e
  #window.onpageshow = -> # try to prevent bfcache
  #  window.location.reload! if it.persisted
  #Storage.save \autoplay on
  #  .then -> Storage.load \autoplay
  #  .then -> console.log it
