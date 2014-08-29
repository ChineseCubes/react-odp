{isArray, isString, cloneDeep} = _
slice = Array.prototype.slice

master-page =
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
          name:     \presentation
          attrs:
            x:      \0
            y:      \0
            width:  \28cm
            height: \21cm
          children: pages
    for let i from 1 to page-total
      CUBEBooks.getPageJSON "#path/page#i.json", -> got-one it, i - 1
  getPageJSON: !(path, done) ->
    data <- $.getJSON path
    data.children = data.children.concat master-page.children
    [, dir] = /(.*\/)?(.*)\.json/exec(path) or [, '']
    done utils.transform data, (attrs = {}, node-name, parents) ->
      new-attrs = style: {}
      for k, v of attrs
        if not /^margin.*/.test k
          name = utils.splitNamespace(k)name
          switch name
          | 'page-width'  => new-attrs.width   = v
          | 'page-height' => new-attrs.height  = v
          | 'width'       => new-attrs.width   = v
          | 'height'      => new-attrs.height  = v
          | 'x'           => new-attrs.x       = v
          | 'y'           => new-attrs.y       = v
          | 'href'        => new-attrs.href    = v
          | 'onclick'     => new-attrs.onclick = v
          | otherwise     => new-attrs.style[ODP.camelFromHyphenated name] = v
      new-attrs
        ..href = "#dir#{new-attrs.href}" if new-attrs.href
  transform: (node, onNode = null, parents = []) ->
    utils.splitNamespace(node.name) <<< do
      text:      node.text
      attrs:     onNode? node.attrs, node.name, parents
      children: if not node.children then [] else
        for child in node.children
          utils.transform child, onNode, parents.concat [node.name]

(this.CUBEBooks ?= {}) <<< utils

