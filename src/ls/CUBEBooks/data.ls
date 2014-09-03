{isArray, isString, cloneDeep, flatten, max} = _
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

c = class Character
  (@pinyin, @zh_TW, @zh_CN = @zh_TW) ~>
  flatten: -> this
o = class Node
  (@en = '', @word-class = '', @definition = '', @children = []) ~>
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
getSegmentations = (text, done)->
  data =
    '洗手台':
      o do
        'Washbasin'
        ['noun']
        'a large bowl or basin used for washing one\'s hands and face'
        * o do
            'Wash'
            ['verb']
            'clean with water'
            [c 'xǐ' '洗']
          o do
            'Hand'
            ['noun']
            'the end part of a person’s arm beyond the wrist, including the palm, fingers, and thumb'
            [c 'shǒu' '手']
          o do
            'Basin'
            ['noun']
            'a wide open container used for preparing food or for holding liquid'
            [c 'tái' '台']
    '他點了又冰又甜的冰淇淋。':
      o do
        'He ordered an icy and sweet ice cream.'
        ['phase']
        'He ordered an icy and sweet ice cream.'
        * o do
            'He'
            ['pronoun']
            'used to refer to a man, boy, or male animal that has already been mentioned or is already known about'
            [c 'tā' '他']
          o do
            'Ordered'
            ['adjective']
            'well arranged or controlled'
            * o do
                'Order'
                ['verb']
                'to ask for food or a drink in a restaurant, bar etc'
                [c 'diǎn' '點' '点']
              o do
                '-ed'
                ['suffix']
                'forms the regular past tense and past participle of verbs'
                [c 'le' '了']
          o do
            'Yet'
            ['adverb']
            'used to emphasize that something is even more than it was before'
            [c 'yòu' '又']
          o do
            'Icy'
            ['adjective']
            'extremely cold'
            [c 'bīng' '冰']
          o do
            'Yet'
            ['adverb']
            'used to emphasize that something is even more than it was before'
            [c 'yòu' '又']
          o do
            'Sweet'
            ['adjective']
            'containing or having a taste like sugar'
            * o do
                'Sweet'
                ['noun']
                'a small piece of sweet food made of sugar or chocolate'
                [c 'tián' '甜']
              o do
                '(adj.)'
                []
                ''
                [c 'de' '的']
          o do
            'Ice Cream'
            ['noun']
            'a frozen sweet food made of milk, cream, and sugar, with fruit, nuts, chocolate etc sometimes added to it'
            * o do
                'Icy'
                ['adjective']
                'extremely cold'
                [c 'bīng' '冰']
              o do
                'Cream'
                ['noun']
                'used in the names of foods containing cream or something similar to it'
                * o do
                    ''
                    ['noun']
                    'name of a river'
                    [c 'qí' '淇']
                  o do
                    'pour'
                    ['verb']
                    'to sprinkle'
                    [c 'lín' '淋']
  done(data[text] or o!)

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
  #Character: Character
  #Node: Node
  getSegmentations: getSegmentations

(this.Data ?= {}) <<< utils

