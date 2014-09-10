{isArray, isString, flatten, max, min, map, zipObject} = _
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
  (@en = '', @word-class = [], @definition = '', @children = []) ~>
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
  '，': o '' [''] 'comma' [c '' '，']
  '。': o '' [''] 'full stop' [c '' '。']
  '？': o '' [''] 'question mark' [c '' '？']

utils =
  splitNamespace: ->
    r = it.toLowerCase!split(':')reverse!
    namespace: r.1
    name:      r.0
  unslash: ->
    "#{it.replace /\/$/ ''}"
  getMasterPage: (path, done) ->
    {attrs}:mp <- $.getJSON "#{utils.unslash path}/masterpage.json"
    # patch it
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
    done mp <<< master-page
  getPresentation: ({setup}:master-page, done) ->
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
      utils.getPageJSON "#{utils.unslash setup.path}/page#i.json", -> got-one it, i - 1
  getPageJSON: !(path, done) ->
    prop-names = <[name x y width height href data onClick]>
    data <- $.getJSON path
    data.children = data.children.concat master-page.children
    [, dir] = /(.*\/)?(.*)\.json/exec(path) or [, '']
    done utils.transform data, (attrs = {}, node-name, parents) ->
      new-attrs = style: {}
      for k, v of attrs
        name = ODP.camelFromHyphenated utils.splitNamespace(k)name
        switch
        | name is 'pageWidth'  => new-attrs.width       = v
        | name is 'pageHeight' => new-attrs.height      = v
        | name in prop-names   => new-attrs[name]       = v
        | otherwise            => new-attrs.style[name] = v
      new-attrs
        ..href = "#dir#{new-attrs.href}" if new-attrs.href
  transform: (node, onNode = null, parents = []) ->
    utils.splitNamespace(node.name) <<< do
      text:      node.text
      attrs:     onNode? node.attrs, node.name, parents
      children: if not node.children then [] else
        for child in node.children
          utils.transform child, onNode, parents.concat [node.name]
  traverse: (node, onNode = null, parents = []) ->
    onNode node, parents
    for child in node.children
      utils.traverse child, onNode, parents.concat [node.name]
  getSegmentations: (text, done)->
    done(utils.data[text] or Node!)
  askMoeDict: (ch, done) ->
    moe <- $.getJSON "www.moedict.tw/~#ch.json"
    tagless = utils.strip
    done do
      zh_TW:   tagless moe.title
      zh_CN:   tagless(moe.heteronyms.0.alt or moe.title)
      pinyin:  tagless moe.heteronyms.0.pinyin
      English: tagless(moe.translation.English)split /,\w*?/
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
  buildSyntaxTreeFromNotes: (node) ->
    tagless = utils.strip
    keys   = []
    values = []
    idx = 0
    keywords = {}
    re = null
    utils.traverse node, (node, parents) ->
      return if not node.text and not node.attrs?data
      if parents.2 isnt 'notes'
        # prepare the root Node of this sentence
        keys.push node.text
        values.push Node '', [], ''
      else if node.attrs.data
        # prepare the RegExp for segmentation
        ks = slice.call node.attrs.data
        ks.sort (a, b) -> b.traditional.length - a.traditional.length
        re := new RegExp(ks.map ->
          # use `map` as `each`
          keywords[it.traditional] = it
          it.traditional
        .join '|')
      else
        # fill the translation,
        (s = values[idx])
          ..en = node.text
          ..definition = node.text
        # and segment the sentence
        str = "#{keys[idx]}"
        while r = re.exec str
          str .= replace r.0, ''
          def = keywords[r.0]
          en = tagless def.translation .split /\//
          shortest = slice.call(en)sort((a, b) -> a.length - b.length)0
          console.log shortest
          # XXX: should sort surrogates
          s.children.push do
            Node do
              shortest
              []
              en.join ', '
              for i from 0 til r.0.length
                c = Char '', r.0[i]
                do
                  data <- utils.askMoeDict r.0[i]
                  c <<< data
                c

        ++idx
    # TODO: deal with punctuation marks
    if keys.length isnt idx
      console.warn 'the translations of sentences are not match'
      console.log keys, values
    utils.data = zipObject keys, values

(this.Data ?= {}) <<< utils

