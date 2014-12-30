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
create-audio-props = (idx) ->
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
            'page-num': idx
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

shortest = -> it.sort((a, b) -> a.length - b.length)0
class Segmentations
  (node, path, done) ~>
    # FIXME: should check the integrity of presentation
    @data = {}
    moe <~ Dict path
    # FIXME: duplicated
    segments   = Data.segments-of node
    dicts      = Data.dicts-of node
    for i of segments
      segs = segments[i]
      dict = dicts[i]
      words = dict.map(-> it['zh-TW'])
      en-by-search = ->
        for word in dict
          if word['zh-TW'] is it
            return word.en
        return []
      for seg in segs
        parts = Data.segment seg.zh, words
        tree = Node do
          parts.map ->
            if it.length is 1
              def = moe.get it
              en = if def
                then slice.call def.en
                else []
              Node do
                [Char def?pinyin, (def?['zh-TW'] or it), def?['zh-CN']]
                en.join ', '
                shortest en
            else
              en = slice.call en-by-search it
              Node do
                for char in it
                  def = moe.get char
                  en = if def
                    then slice.call def.en
                    else []
                  Node do
                    [Char def?pinyin, (def?['zh-TW'] or char), def?['zh-CN']]
                    en.join ', '
                    shortest en
                en.join ', '
                shortest en
          seg.en
          seg.en
        if tree.children.length is 1
          # keep tree.definition and tree.short
          tree.children = tree.children.0.children
        @data[seg.zh] = tree
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
        'line-height': '2.275cm'
        'font-size': '1.1cm'
    * name: \frame
      namespace: \draw
      id: 'read-to-me'
      attrs:
        x: '7.875cm'
        y: '0cm'
        width:  '7.35cm'
        height: '2.275cm'
        'line-height': '2.275cm'
        'font-size': '1.1cm'
      children: []
    * name: \frame
      namespace: \draw
      id: 'learn-by-myself'
      attrs:
        x: '15.75cm'
        y: '0cm'
        width:  '7.35cm'
        height: '2.275cm'
        'line-height': '2.275cm'
        'font-size': '1.1cm'
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
    mp
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
    name = data.attrs['DRAW:NAME']
    if name isnt \page1
      idx = +name.replace 'page', ''
      data.children = data.children.concat create-audio-props(idx - 1)children
    Data.transform data, (attrs = {}, node-name, parents) ->
      new-attrs = style: {}
      for k, v of attrs
        name = camelFromHyphenated splitNamespace(k)name
        switch
        | name is 'pageWidth'  => new-attrs.width       = v
        | name is 'pageHeight' => new-attrs.height      = v
        | name in prop-names   => new-attrs[name]       = v
        | name is 'pageNum'    => new-attrs[name]       = v
        #| name is 'fontFamily' => new-attrs.style[name] = noto-name v
        | otherwise            => new-attrs.style[name] = v
      new-attrs
        ..href = "#path/#{new-attrs.href}" if new-attrs.href
  paragraphs-of: (presentation) ->
    var sentences, str
    paragraphs = []
    Data.parse do
      presentation
      (node, parents) ->
        if (node.name is \page)
          sentences := []
        if (node.name is \span) and
           not (\notes in parents) and
           node.text
          str := node.text
      (node, parents) ->
        if (node.name is \span) and
           not (\notes in parents) and
           node.text
          sentences.push str
        if (node.name is \page)
          paragraphs.push sentences
    paragraphs
  segments-of: (presentation) ->
    var count, sgmnt
    segments = []
    Data.parse do
      presentation
      (node, parents) ->
        if (node.name is \page)
          segments.push []
          count := 0
        if (node.name is \span) and (\notes in parents)
          sgmnt := {} if not sgmnt
          if count % 2 is 0
            then sgmnt.zh = node.text
            else sgmnt.en = node.text
      (node, parents) ->
        if (node.name is \span) and (\notes in parents)
          if count % 2 is 1
            segments[*-1]push sgmnt
            sgmnt := undefined
          ++count
        if (node.name is \page)
          # XXX: backward compatible
          # If sgmnt isnt undefined, there are no segment pairs in this page.
          # So the segment may  be just an English transaltion of this page.
          if sgmnt
            sgmnt
              ..en = sgmnt.zh
              ..zh = undefined
            segments[*-1]push sgmnt
            sgmnt := undefined
    segments
  dicts-of: (presentation) ->
    dict = []
    Data.parse do
      presentation
      (node, parents) ->
        if (node.name is \page)
          dict[*] = []
        if (node.attrs.data)
          dict[*-1] =
            for d in node.attrs.data
              'zh-TW': d.traditional
              'zh-CN': d.simplified
              pinyin:  d.pinyin_marks
              en:      tagless d.translation .split /\//
    dict
  transform: (node, onNode = null, parents = []) ->
    splitNamespace(node.name) <<< do
      text:      node.text
      attrs:     onNode? node.attrs, node.name, parents
      children: if not node.children then [] else
        for child in node.children
          Data.transform child, onNode, parents.concat [node.name]
  #traverse: (node, onNode, parents = []) ->
  #  return if not onNode
  #  onNode node, parents
  #  return if not node.children
  #  for child in node.children
  #    Data.traverse child, onNode, parents.concat [node.name]
  parse: (node, onEnter, onLeave, parents = []) ->
    return if not node
    onEnter? node, parents
    return if not node.children
    for child in node.children
      Data.parse child, onEnter, onLeave, parents.concat [node.name]
    onLeave? node, parents
  segment: (str, segs = [], longest = true) ->
    | not str?length   => []
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
          # push skipped word
          words.push str.substring lastIndex, r.index
        lastIndex = re.lastIndex
        words.push r.0
      if lastIndex isnt str.length
        words.push str.substring lastIndex
      words
  Segmentations: Segmentations

module.exports = Data

