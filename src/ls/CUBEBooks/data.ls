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
  askMoeDict: (str, done) ->
    counter = 0
    result = {}
    tagless = utils.strip
    # XXX: should sort surrogates
    for let i from 0 til str.length
      moe <- $.getJSON "www.moedict.tw/~#{str[i]}.json"
      result[+i] =
        zh_TW:   tagless moe.title
        zh_CN:   tagless(moe.heteronyms.0.alt or moe.title)
        pinyin:  tagless moe.heteronyms.0.pinyin
        English: tagless(moe.translation.English)split /,\w*?/
      if ++counter is str.length
        done result
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
              children.map if children.length is 1
                -> Char '', it
              else
                -> Node [Char '', it]
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
          key = r.0
          child = keywords[r.0]
          let key, child
            moe <- utils.askMoeDict key
            if key.length is 1
              child.children.0 <<< moe.0{pinyin, zh_TW, zh_CN}
            else
              for i from 0 til key.length
                continue if not moe[i]
                console.log moe[i]{pinyin, zh_TW, zh_CN}
                en = moe[i]English
                child.children[i]
                  ..definition = en.join ', '
                  ..short = en.sort((a, b) -> a.length - b.length)0
                  ..children.0 <<< moe[i]{pinyin, zh_TW, zh_CN}
          s.children.push child
          str = str.replace key, ''
        ++idx
    # TODO: deal with punctuation marks
    if keys.length isnt idx
      console.warn 'the translations of sentences are not match'
      console.log keys, values
    utils.data = zipObject keys, values

(this.Data ?= {}) <<< utils

