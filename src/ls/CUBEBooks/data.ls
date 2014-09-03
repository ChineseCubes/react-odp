{isArray, isString, cloneDeep, flatten, max, zipObject} = _
slice = Array::slice

master-page =
  children:
    * name: 'draw:frame'
      attrs:
        'style-name': \Mgr3
        'text-style-name': \MP4
        x:      \0.19cm
        y:      \0.22cm
        width:  \1.41cm
        height: \1.198cm
      children:
        * name: 'draw:image'
          attrs:
            href: 'Pictures/100002010000002800000022F506C368.png'
            'on-click': -> alert 'home'
        ...
    * name: 'draw:frame'
      attrs:
        'style-name': \Mgr4
        'text-style-name': \MP4
        x:      \26.4cm
        y:      \0.4cm
        width:  \1.198cm
        height: \1.198cm
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

utils =
  splitNamespace: ->
    r = it.toLowerCase!split(':')reverse!
    namespace: r.1
    name:      r.0
  getPresentation: (path, done) ->
    pages = []
    page-total = 8
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
  strip: ->
    tmp = document.createElement 'span'
    tmp.innerHTML = it
    tmp.textContent or tmp.innerText or ''
  buildSyntaxTreeFromNotes: (node) ->
    keys   = []
    values = []
    zh = null
    en = null
    current = 0
    utils.traverse node, (node, parents) ->
      return if not node.text
      if parents.2 isnt 'notes'
        keys.push node.text
      else
        if keys.length > values.length
          values.push Node do
            node.text
            []
            node.text
        else
          return if current >= values.length
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
            ++current if not new RegExp(zh)test keys[current]
            char = Char!
            values[current]children.push do
              Node en, [], en,
                if zh.length is 1
                  char = Char!
                  do
                    moe <- $.get "https://www.moedict.tw/~#zh.json"
                    char
                      ..zh_TW = utils.strip moe.title
                      ..zh_CN = utils.strip moe.heteronyms.0.alt
                      ..pinyin = utils.strip moe.heteronyms.0.pinyin
                  [char]
                else
                  for let c in zh
                    char = Char!
                    n = Node '', [], '', [char]
                    do
                      moe <- $.get "https://www.moedict.tw/~#c.json"
                      char
                        ..zh_TW = utils.strip moe.title
                        ..zh_CN = utils.strip moe.heteronyms.0.alt
                        ..pinyin = utils.strip moe.heteronyms.0.pinyin
                      n.definition = utils.strip moe.translation.English
                    n
            zh := null
            en := null
    utils.data = zipObject keys, values

(this.Data ?= {}) <<< utils

