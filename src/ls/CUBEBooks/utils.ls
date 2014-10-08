say-it = (text, lang = \en-US) ->
  syn = try window.speechSynthesis
  utt = try window.SpeechSynthesisUtterance
  return if not syn or not utt
  u = new utt text
    ..lang = lang
    ..volume = 1.0
    ..rate = 1.0
  syn.speak u

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

splitNamespace = ->
  r = it.toLowerCase!split(':')reverse!
  namespace: r.1
  name:      r.0

camelFromHyphenated = ->
  it
    .split '-'
    .map (v, i) ->
      | i is 0  => v
      | otherwise =>"#{v.slice(0, 1)toUpperCase!}#{v.slice(1)}"
  .join ''

module.exports = {
  say-it
  unslash
  strip
  splitNamespace
  camelFromHyphenated
}
