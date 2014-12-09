try require! fs
fs ?= readFile: (path, done) ->
  data <- $.get path, null, _, \text
  done null, data

{ isArray, isString, flatten, max, min, map, zipObject } = require \lodash
{
  unslash
  strip:tagless
  splitNamespace
  camelFromHyphenated
  noto-name
} = require './utils'
slice = Array::slice

shadow = '0 0 5px 5px rgba(0,0,0,0.1);'
master-page =
  children:
    * name: 'draw:frame'
      attrs:
        'style-name': \Mgr4
        'text-style-name': \MP4
        x:      \25.16cm
        y:      \1.35cm
        width:  \1.458cm
        height: \1.358cm
      children:
        * name: 'draw:image'
          attrs:
            name: 'activity'
            href: '../images/play.png'
            'on-click': -> ...
            'font-size': '1cm'
        ...

c = class Char
  (@pinyin = '', @['zh-TW'] = '', @['zh-CN'] = @['zh-TW']) ~>
  flatten: -> this
o = class Node
  (@children = [], @definition = '', @short = '', @word-class = []) ~>
  flatten: -> flatten <| for @children => ..flatten!
  toString: (mode) ->
    | not mode in <[zh-TW zh-CN]> => ''
    | otherwise                   => @flatten!map(-> it[mode])join('')
  isLeaf:  -> not @children.0.isLeaf
  leafs:   ->
    | @isLeaf!  => [this]
    | otherwise => flatten <| for @children => ..leafs!
  depth:   ->
    | @isLeaf!  => 0
    | otherwise => 1 + (max <| for @children => ..depth!)
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
    # XXX: should sort surrogates
    err, data <~ fs.readFile "#path/dict.json"
    moe = JSON.parse data
    for c of moe
      moe[c]
        ..['zh-TW']  = tagless moe[c]['zh-TW']
        ..['zh-CN']  = tagless moe[c]['zh-CN']
        ..pinyin = tagless moe[c]pinyin
        ..en .= map (tagless)
    @data = moe
    done? this
  get: ->
    @data[it]

class Segmentations
  (node, path, done) ~>
    dict <~ Dict path
    keys   = []
    values = []
    idx = 0
    keywords = {} <<< punctuations
    re = null
    Data.traverse node, (node, parents) ->
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
                  Char moe?pinyin, (moe?['zh-TW'] or it), moe?['zh-CN']
                else
                  en = slice.call moe.en
                  Node do
                    [Char moe?pinyin, (moe?['zh-TW'] or it), moe?['zh-CN']]
                    en.join ', '
                    en.sort((a, b) -> a.length - b.length)0
              en.join ', '
              shortest
          it.traditional
        re := new RegExp Object.keys(punctuations)concat(re)join('|'), \g
      else
        # fill the translation,
        (s = values[idx])
          ..short = node.text
          ..definition = node.text
        # and segment the sentence
        str = "#{keys[idx]}"
        #console.warn re, str
        lastIndex = 0
        while r = re.exec str
          if lastIndex isnt r.index
            for char in Array::slice.call str.substring lastIndex, r.index
              Array::push.apply s.children, keywords[char]
          lastIndex = re.lastIndex
          s.children.push keywords[r.0]
        if lastIndex isnt str.length
          for char in Array::slice.call str.substring lastIndex
            Array::push.apply s.children, keywords[char]
        ++idx
    # FIXME: should warn this when build
    #if keys.length isnt idx
    #  console.warn 'the translations of sentences are not match'
    #  console.log keys, values
    @data = zipObject keys, values
    done? this
  get: ->
    @data[it]

mode-selectors =
  name: \frame
  namespace: \draw
  attrs:
    x: '2.45cm'
    y: '17.85cm'
    width:  '23.1cm'
    height: '2.275cm'
  children:
    * name: \frame
      namespace: \draw
      id: 'glossary'
      attrs:
        x: '0cm'
        y: '0cm'
        width:  '7.35cm'
        height: '2.275cm'
    * name: \frame
      namespace: \draw
      id: 'read-to-me'
      attrs:
        x: '7.875cm'
        y: '0cm'
        width:  '7.35cm'
        height: '2.275cm'
      children: []
    * name: \frame
      namespace: \draw
      id: 'learn-by-myself'
      attrs:
        x: '15.75cm'
        y: '0cm'
        width:  '7.35cm'
        height: '2.275cm'
      children: []
with-mode-selectors = (page) ->
  page.children.push mode-selectors
  page

Data =
  Node: Node
  Char: Char
  punctuations: punctuations
  getMasterPage: (path, done) ->
    path = unslash path
    fs.readFile "#path/masterpage.json" (err, data) ->
      done Data.patchMasterPage JSON.parse(data), path
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
    path = unslash setup.path
    pages = []
    counter = 0
    got-one = (data, i) ->
      switch i
        | 0 => pages[i] = data |> with-mode-selectors
        | _ => pages[i] = data
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
      err, data <- fs.readFile "#path/page#i.json"
      got-one Data.patchPageJSON(JSON.parse(data), path), i - 1
  patchPageJSON: (data, path = '') ->
    prop-names = <[name x y width height href data onClick onTouchStart]>
    data.children = data.children.concat master-page.children
    Data.transform data, (attrs = {}, node-name, parents) ->
      new-attrs = style: {}
      for k, v of attrs
        name = camelFromHyphenated splitNamespace(k)name
        switch
        | name is 'pageWidth'  => new-attrs.width       = v
        | name is 'pageHeight' => new-attrs.height      = v
        | name in prop-names   => new-attrs[name]       = v
        #| name is 'fontFamily' => new-attrs.style[name] = noto-name v
        | otherwise            => new-attrs.style[name] = v
      new-attrs
        ..href = "#path/#{new-attrs.href}" if new-attrs.href
  transform: (node, onNode = null, parents = []) ->
    splitNamespace(node.name) <<< do
      text:      node.text
      attrs:     onNode? node.attrs, node.name, parents
      children: if not node.children then [] else
        for child in node.children
          Data.transform child, onNode, parents.concat [node.name]
  traverse: (node, onNode, parents = []) ->
    return if not onNode
    onNode node, parents
    return if not node.children
    for child in node.children
      Data.traverse child, onNode, parents.concat [node.name]
  segment: (str, segs = [], longest = true) ->
    | not str?length   => null
    | segs.length is 0 => [str.slice!]
    | otherwise        =>
      segs.sort if longest
        then (a, b) -> b.length - a.length
        else (a, b) -> a.length - b.length
      segs .= filter (isnt str)
      re = "#{Object.keys(punctuations)concat(segs)join('|')}"
      re = new RegExp re, \g
      words = []
      lastIndex = 0
      while r = re.exec str
        if lastIndex isnt r.index
          # push skiped word
          Array::push.apply words, Array::slice.call str.substring lastIndex, r.index
        lastIndex = re.lastIndex
        words.push r.0
      if lastIndex isnt str.length
        Array::push.apply words, Array::slice.call str.substring lastIndex
      words
  Segmentations: Segmentations

module.exports = Data

