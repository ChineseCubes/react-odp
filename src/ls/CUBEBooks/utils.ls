{isArray, isString, cloneDeep} = _
slice = Array.prototype.slice

(styles = {})
  ..DefaultTitle =
    # graphic properties, WTF?
    textarea-vertical-align: 'middle'
    # paragraph properties
    line-height:  '150%'
    text-align:   'center'
    # text properties
    font-family:  'Noto Sans T Chinese, Heiti TC, Arial Unicode MS'
    font-size:    '44pt'
    font-weight:  'normal'
    text-shadow:  'none'
  ..DefaultNotes =
    margin-left:  '0.6cm'
    margin-right: '0cm'
    text-indent:  '-0.6cm'
    font-family:  'Liberation Sans, Heiti TC, Arial Unicode MS'
    font-size:    '20pt'
    font-weight:  'normal'
    text-shadow:  'none'
  ..dp1 = {}
  ..dp2 = {}
  ..pr1 = Object.create do
    styles.DefaultTitle
    min-height:
      value: '3.506cm'
      enumerable: true
  ..pr2 = Object.create do
    styles.DefaultNotes
    min-height:
      value: '13.364cm'
      enumerable: true
  ..pr3 = Object.create do
    styles.DefaultTitle
    textarea-vertical-align:
      value: 'bottom'
      enumerable: true
    min-height:
      value: '3.506cm'
      enumerable: true
  ..gr1 = # skip the parent style 'Object with no fill and no line'
    vertical-align: 'middle'
    opacity:        1.0
  ..gr2 = {}
  ..P1 =
    text-align:   'start'
    font-family:  'Noto Sans T Chinese'
  ..P2 =
    text-align:   'center'
  ..P3 =
    font-family:  'Noto Sans T Chinese'
  ..P4 =
    font-size:    '20pt'
  ..P5 =
    font-family:  'cwTeX Q KaiZH'
  ..P6 =
    margin-top:    '0cm'
    margin-bottom: '0cm'
    line-height:   '150%'
    font-size:     '30pt'
  ..P7 =
    margin-top:    '0cm'
    margin-bottom: '0cm'
    line-height:   '150%'
    font-family:   'Noto Sans T Chinese'
    font-size:     '30pt'
  ..P8 =
    line-height:  '150%'
    font-size:    '24pt'
  ..P9 =
    line-height:  '150%'
    font-family:  'Noto Sans T Chinese'
    font-size:    '24pt'
  ..T1 =
    font-family:  'Noto Sans T Chinese'
  ..T2 =
    font-family:  'cwTeX Q KaiZH'
  ..T3 =
    font-family:  'Noto Sans T Chinese'
    font-size:    '30pt'
  ..T4 =
    font-family:  'Noto Sans T Chinese'
    font-size:    '24pt'
  ..Mgr3 = # skip the parent style 'Object with no fill and no line'
    textarea-vertical-align: 'middle'
    #luminance: '-9%' #!?
  ..Mgr4 = # skip the parent style 'Object with no fill and no line'
    textarea-vertical-align: 'middle'
  ..MP4 =
    text-align:   'center'
    font-family:  'Noto Sans T Chinese'
    font-size:    '18pt'
master-page$ =
  children:
    * name: 'frame'
      attrs:
        'style-name': \Mgr3
        'text-style-name': \MP4
        x:      \0.19cm
        y:      \0.22cm
        width:  \1.41cm
        height: \1.198cm
      children:
        * name: 'image'
          attrs:
            href: 'Pictures/100002010000002800000022F506C368.png'
            onclick: 'home'
          #children:
          #  * name: 'p'
          #    attrs:
          #      'style-name': \MP4
          #    children:
          #      * name: 'span'
          #        text: 'home'
          #      ...
          #  ...
        ...
    * name: 'frame'
      attrs:
        'style-name': \Mgr4
        'text-style-name': \MP4
        x:      \26.4cm
        y:      \0.4cm
        width:  \1.198cm
        height: \1.198cm
      children:
        * name: 'image'
          attrs:
            href: 'Pictures/1000020100000022000000223520C9AB.png'
            onclick: 'activity'
          #children:
          #  * name: 'p'
          #    attrs:
          #      'style-name': \MP4
          #    children:
          #      * name: 'span'
          #        text: 'activity'
          #      ...
          #  ...
        ...
master-page =
  frame:
    * '@attributes':
        'style-name': \Mgr3
        'text-style-name': \MP4
        x:      \0.19cm
        y:      \0.22cm
        width:  \1.41cm
        height: \1.198cm
      image:
        '@attributes':
          href: 'Pictures/100002010000002800000022F506C368.png'
        p:
          '@attributes':
            'style-name': \MP4
          span: 'home'
    * '@attributes':
        'style-name': \Mgr4
        'text-style-name': \MP4
        x:      \26.4cm
        y:      \0.4cm
        width:  \1.198cm
        height: \1.198cm
      image:
        '@attributes':
          href: 'Pictures/1000020100000022000000223520C9AB.png'
        p:
          '@attributes':
            'style-name': \MP4
          span: 'activity'

utils =
  splitNamespace: ->
    r = it.toLowerCase!split(':')reverse!
    namespace: r.1
    name:      r.0
  getPageJSON: !(path, done) ->
    data <- $.getJSON path
    data.children = data.children.concat master-page$.children
    #data.attrs <<< x: \0 y: \0 width: \28cm height: \21cm
    [, dir] = /(.*\/)?(.*)\.json/exec(path) or [, '']
    done utils.transform data, (attrs = {}, node-name) ->
      new-attrs = {}
      for k, v of attrs
        if not /^margin.*/.test k
          name = utils.splitNamespace(k)name
          name = 'width'  if name is 'page-width'
          name = 'height' if name is 'page-height'
          new-attrs[name] = v
      if node-name is 'DRAW:FRAME'
        console.log styles[new-attrs['style-name']], attrs, node-name
      new-attrs
        #..style = styles[new-attrs['style-name']]
        #..text-style = styles[new-attrs['text-style-name']]
        ..href = "#dir#{new-attrs.href}" if new-attrs.href
  transform: (node, onNode = null, parents = []) ->
    utils.splitNamespace(node.name) <<< do
      text:      node.text
      attrs:     onNode? node.attrs, node.name, parents
      children: if not node.children then [] else
        for child in node.children
          utils.transform child, onNode, parents.concat [node.name]

(this.CUBEBooks ?= {}) <<< utils

