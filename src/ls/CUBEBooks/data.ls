require ?= let packages = lodash: _ => -> packages[it]
{isArray, isString, flatten, max, min, map, zipObject} = require \lodash
slice = Array::slice

shadow = '0 0 5px 5px rgba(0,0,0,0.1);'
master-page =
  children:
    * name: 'draw:frame'
      attrs:
        background: '#fff'
        opacity: '0.75'
        '-webkit-box-shadow': shadow
        '-moz-box-shadow': shadow
        'box-shadow': shadow
        width:  \28cm
        height: \2cm
    * name: 'draw:frame'
      attrs:
        'style-name': \Mgr3
        'text-style-name': \MP4
        x:      \0.34cm
        y:      \0.38cm
        width:  \1.41cm
        height: \1.198cm
      children:
        * name: 'draw:image'
          attrs:
            href: '../images/home.png'
            'on-click': -> alert 'home'
        ...
    * name: 'draw:frame'
      attrs:
        'style-name': \Mgr4
        'text-style-name': \MP4
        x:      \26.16cm
        y:      \0.35cm
        width:  \1.458cm
        height: \1.358cm
      children:
        * name: 'draw:image'
          attrs:
            name: 'activity'
            href: '../images/play.png'
            'on-click': -> ...
        ...

c = class Char
  (@pinyin, @zh_TW, @zh_CN = @zh_TW) ~>
  flatten: -> this
o = class Node
  (@children = [], @definition = '', @short = '', @word-class = []) ~>
  flatten: -> flatten <| for child in @children => child.flatten!
  isLeaf:  -> not @children.0.leafs
  leafs:   ->
    | @isLeaf!  => [this]
    | otherwise => flatten <| for child in @children => child.leafs!
  depth:   ->
    | @isLeaf!  => 0
    | otherwise => 1 + (max <| for child in @children => child.depth!)
  childrenOfDepth: (depth) ->
    | @isLeaf!   => [this]
    | depth is 0 => [this]
    | otherwise
      flatten <| for child in @children => child.childrenOfDepth depth - 1

punctuations =
  '，': o [c '' '，'] 'comma'
  '。': o [c '' '。'] 'full stop'
  '？': o [c '' '？'] 'question mark'
  '！': o [c '' '！'] 'exciamation mark'
  '「': o [c '' '「'] 'quotation mark'
  '」': o [c '' '」'] 'quotation mark'
  '、': o [c '' '、'] 'enumeration comma'
  '‧':  o [c '' '‧']  'middle dot'
  '《': o [c '' '《'] 'title mark'
  '》': o [c '' '》'] 'middle dot'
  '…':  o [c '' '…']  'ellipsis'
  '～': o [c '' '～'] 'wavy dash'
  '　': o [c '' '　'] 'space'

class Dict
  (path, done) ~>
    tagless = utils.strip
    # XXX: should sort surrogates
    moe <~ $.getJSON "#path/dict.json"
    for c of moe => moe[c]en .= map (tagless)
    @data = moe
    done? this
  get: ->
    @data[it]

class Segmentations
  (node, path, done) ~>
    dict <~ Dict path
    tagless = utils.strip
    keys   = []
    values = []
    idx = 0
    keywords = {} <<< punctuations
    re = null
    utils.traverse node, (node, parents) ->
      return if not node.text and not node.attrs?data
      if parents.2 isnt 'notes'
        # prepare the root Node of this sentence
        keys.push node.text
        values.push Node!
      else if node.attrs.data
        # prepare the RegExp for segmentation
        ks = slice.call node.attrs.data
        ks.sort (a, b) -> b.traditional.length - a.traditional.length
        re := ks.map ->
          str = it.traditional
          en = tagless it.translation .split /\//
          shortest = slice.call(en)sort((a, b) -> a.length - b.length)0
          children = slice.call str
          # use `map` as `each`
          # FIXME: too much
          keywords[it.traditional] =
            Node do
              children.map ->
                moe = dict.get it
                if children.length is 1
                  Char moe?pinyin, (moe?zh_TW or it), moe?zh_CN
                else
                  en = slice.call moe.en
                  Node do
                    [Char moe?pinyin, (moe?zh_TW or it), moe?zh_CN]
                    en.join ', '
                    en.sort((a, b) -> a.length - b.length)0
              en.join ', '
              shortest
          it.traditional
        re := new RegExp Object.keys(punctuations)concat(re)join '|'
      else
        # fill the translation,
        (s = values[idx])
          ..short = node.text
          ..definition = node.text
        # and segment the sentence
        str = "#{keys[idx]}"
        while r = re.exec str
          s.children.push keywords[r.0]
          str = str.replace r.0, ''
        ++idx
    if keys.length isnt idx
      console.warn 'the translations of sentences are not match'
      console.log keys, values
    @data = zipObject keys, values
    done? this
  get: ->
    @data[it]

utils =
  splitNamespace: ->
    r = it.toLowerCase!split(':')reverse!
    namespace: r.1
    name:      r.0
  unslash: ->
    "#{it.replace /\/$/ ''}"
  camelFromHyphenated : ->
    it
      .split '-'
      .map (v, i) ->
        | i is 0  => v
        | otherwise =>"#{v.slice(0, 1)toUpperCase!}#{v.slice(1)}"
    .join ''
  getMasterPage: (path, done) ->
    path = utils.unslash path
    $.getJSON "#path/masterpage.json" -> done utils.patchMasterPage it, path
  patchMasterPage: ({attrs}:mp, path) ->
    width  = parseInt attrs['FO:PAGE-WIDTH'],  10
    height = parseInt attrs['FO:PAGE-HEIGHT'], 10
    orientation = attrs['STYLE:PRINT-ORIENTATION']
    ratio = if orientation is \landscape then width / height else height / width
    mp.setup =
      path:   path
      ratio:  ratio
      x:      0cm
      y:      0cm
      width:  width
      height: height
      total-pages: attrs['TOTAL-PAGES']
    mp <<< master-page
  getPresentation: ({setup}:master-page, done) ->
    path = utils.unslash setup.path
    pages = []
    counter = 0
    got-one = (data, i) ->
      data.attrs.y = "#{i * 21.5}cm"
      pages.push data
      counter += 1
      if counter is setup.total-pages
        done do
          name:      \presentation
          namespace: \office
          attrs:
            x:      \0
            y:      \0
            width:  \28cm
            height: \21cm
          children:  pages
    for let i from 1 to setup.total-pages
      data <- $.getJSON "#path/page#i.json"
      got-one utils.patchPageJSON(data, path), i - 1
  patchPageJSON: (data, path = '') ->
    prop-names = <[name x y width height href data onClick]>
    data.children = data.children.concat master-page.children
    utils.transform data, (attrs = {}, node-name, parents) ->
      new-attrs = style: {}
      for k, v of attrs
        name = utils.camelFromHyphenated utils.splitNamespace(k)name
        switch
        | name is 'pageWidth'  => new-attrs.width       = v
        | name is 'pageHeight' => new-attrs.height      = v
        | name in prop-names   => new-attrs[name]       = v
        | otherwise            => new-attrs.style[name] = v
      new-attrs
        ..href = "#path/#{new-attrs.href}" if new-attrs.href
  transform: (node, onNode = null, parents = []) ->
    utils.splitNamespace(node.name) <<< do
      text:      node.text
      attrs:     onNode? node.attrs, node.name, parents
      children: if not node.children then [] else
        for child in node.children
          utils.transform child, onNode, parents.concat [node.name]
  traverse: (node, onNode, parents = []) ->
    return if not onNode
    onNode node, parents
    return if not node.children
    for child in node.children
      utils.traverse child, onNode, parents.concat [node.name]
  strip: ->
    tmp = document.createElement 'span'
    tmp.innerHTML = switch
      | document.contentType is 'application/xhtml+xml'
        new XMLSerializer!serializeToString(
          new DOMParser!parseFromString(it, 'text/html').body
        ).replace(/^<body[^>]*>/, '').replace(/<\/body>$/, '')
      | document.xmlVersion
        dom = document.implementation.createHTMLDocument ''
        dom.body.innerHTML = it
        new XMLSerializer!serializeToString(
          dom.body
        ).replace(/^<body[^>]*>/, '').replace(/<\/body>$/, '')
      | otherwise => it
    tmp.textContent or tmp.innerText or ''
  Segmentations: Segmentations

(this.Data ?= {}) <<< utils
module?exports = this.Data

