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
            href: 'Pictures/home.png'
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
            href: 'Pictures/1000020100000022000000223520C9AB.png'
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
  getPresentation: (path, page-total, done) ->
    pages = []
    counter = 0
    got-one = (data, i) ->
      data.attrs.y = "#{i * 21.5}cm"
      pages.push data
      counter += 1
      if counter is page-total
        done do
          name:      \presentation
          namespace: \office
          attrs:
            x:      \0
            y:      \0
            width:  \28cm
            height: \21cm
          children:  pages
    for let i from 1 to page-total
      utils.getPageJSON "#path/page#i.json", -> got-one it, i - 1
  getPageJSON: !(path, done) ->
    prop-names = <[name x y width height href onClick]>
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
  #Character: Character
  #Node: Node
  getSegmentations: (text, done)->
    done(utils.data[text] or Node!)
  askMoeDict: (ch, done) ->
    moe <- $.get "https://www.moedict.tw/~#ch.json"
    tagless = utils.strip
    done do
      zh_TW:   tagless moe.title
      zh_CN:   tagless(moe.heteronyms.0.alt or moe.title)
      pinyin:  tagless moe.heteronyms.0.pinyin
      English: tagless(moe.translation.English)split /,\w*?/
  strip: ->
    tmp = document.createElement 'span'
    tmp.innerHTML = new XMLSerializer().serializeToString do
      new DOMParser!parseFromString it, 'text/html'
    tmp.textContent or tmp.innerText or ''
  buildSyntaxTreeFromNotes: (node) ->
    keys   = []
    values = []
    keywords = []
    zh = null
    en = null
    utils.traverse node, (node, parents) ->
      return if not node.text
      if parents.2 isnt 'notes'
        current = keywords[*-1]
        if not current or 0 isnt Object.keys current .length
          keywords.push {}
        else
          # use the same container if get another sentence
          # and keep the length of keywords is the same as keys
          keywords.push current
        keys.push node.text
      else
        if keys.length > values.length
          values.push Node do
            node.text
            []
            node.text
        else
          if not zh
            ss = node.text.split ' '
            if ss.length isnt 1
              zh := ss.0
              en := ss.1
            else
              zh := node.text
          else if not en
            en := node.text
          if zh and en
            keywords[*-1][zh] =
              Node en, [], en,
                if zh.length is 1
                  char = Char!
                  do
                    moe <- utils.askMoeDict zh
                    delete moe.English
                    char <<< moe
                  [char]
                else
                  for let c in zh
                    char = Char!
                    n = Node '', [], '', [char]
                    do
                      moe <- utils.askMoeDict c
                      char <<< moe{zh_TW, zh_CN, pinyin}
                      def = min moe.English, \length
                      n
                        ..en         = def
                        ..definition = moe.English.join ', '
                    n
            zh := null
            en := null
    # XXX:  maybe there is a better solution
    # TODO: deal with punctuation marks
    if keys.length isnt values.length
      console.warn 'the translations of sentences are not match'
    for i, ks of keywords
      key = "#{keys[i]}"
      value = values[i]
      if not Object.keys(ks)length
        console.warn "segment translations of '#key' are missing"
        continue
      ks <<< punctuations
      reverse-sorted = Object.keys(ks)sort (a, b) -> b.length - a.length
      re = new RegExp reverse-sorted.join '|'
      while r = re.exec key
        key = key.replace r.0, ''
        value.children.push ks[r.0]
    utils.data = zipObject keys, values

(this.Data ?= {}) <<< utils

