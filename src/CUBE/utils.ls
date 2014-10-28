say-it = (text, lang = \en-US) !->
  setTimeout ->
    syn = try window.speechSynthesis
    utt = try window.SpeechSynthesisUtterance
    return unless syn and utt
    u = new utt text
      ..lang = lang
      ..volume = 1.0
      ..rate = 1.0
    syn.speak u
  , 0

unslash = -> "#{it.replace /\/$/ ''}"

strip = -> it.replace /<.*?>/g -> ''
  #tmp = document.createElement 'span'
  #tmp.innerHTML = switch
  #  | document.contentType is 'application/xhtml+xml'
  #    new XMLSerializer!serializeToString(
  #      new DOMParser!parseFromString(it, 'text/html').body
  #    ).replace(/^<body[^>]*>/, '').replace(/<\/body>$/, '')
  #  | document.xmlVersion
  #    dom = document.implementation.createHTMLDocument ''
  #    dom.body.innerHTML = it
  #    new XMLSerializer!serializeToString(
  #      dom.body
  #    ).replace(/^<body[^>]*>/, '').replace(/<\/body>$/, '')
  #  | otherwise => it
  #tmp.textContent or tmp.innerText or ''

split-namespace = ->
  r = it.toLowerCase!split(':')reverse!
  namespace: r.1
  name:      r.0

camel-from-hyphenated = ->
  it
    .split '-'
    .map (v, i) ->
      | i is 0  => v
      | otherwise =>"#{v.slice(0, 1)toUpperCase!}#{v.slice(1)}"
  .join ''

onClick = if (try \ontouchstart of window) then \onTouchStart else \onClick

module.exports = {
  say-it
  unslash
  strip
  split-namespace
  camel-from-hyphenated
  onClick
}
