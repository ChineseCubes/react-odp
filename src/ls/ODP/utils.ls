{div} = React.DOM
{isArray, isString, isPlainObject} = _
slice = Array.prototype.slice

DotsDetector = React.createClass do
  displayName: 'UnitDetector'
  pxFromStyle: ->
    result = /(\d*\.?\d+)px/exec it
    [,px] = result if result
    +px
  # not now
  #mixins: [PureRenderMixin]
  getDefaultProps: ->
    unit:  \in
    scale: 1024
  getInitialState: ->
    x: 96
    y: 96
  ##
  # get dots per inch and dots per cm by using window.getComputedStyle
  # the results in different browsers are not the same
  componentDidMount: !->
    style = getComputedStyle @refs.unit.getDOMNode!
    @state
      ..x = @pxFromStyle(style.width)  / @props.scale
      ..y = @pxFromStyle(style.height) / @props.scale
  render: ->
    div do
      ref: \unit
      style: do
        position: \absolute
        display:  \none
        width:    "#{@props.scale}#{@props.unit}"
        height:   "#{@props.scale}#{@props.unit}"

styles = {}
styles
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
  ..pr1 = Object.create styles.DefaultTitle, do
    min-height:
      value: '3.506cm'
  ..pr2 = Object.create styles.DefaultNotes, {}
  ..gr1 = # skip the parent style 'Object with no fill and no line'
    vertical-align: 'middle'
    opacity:        1.0
  ..P1 =
    text-align:   'start'
    font-family:  'Noto Sans T Chinese'
  ..P2 =
    text-align:   'center'
  ..T1 =
    font-family:  'Noto Sans T Chinese'

utils =
  DotsDetector: DotsDetector
  getPageJSON: !(path, done) ->
    data <- $.getJSON path
    data['@attributes'] <<< do
      x:      \0
      y:      \0
      width:  \28cm
      height: \21cm
    data = page: data
    frame-count = 0
    span-count = 0
    [, dir, file] = /(.*\/)?(.*)\.json/exec(path) or [, '', '']
    tree = utils.map data, (value, key, parents)->
      attrs = value['@attributes'] or {}
      # append fake data to page1
      switch file
      | 'page1'
        switch key
        | 'frame'
          switch frame-count
          | 0
            attrs
              ..style = styles.pr1
              ..text-style = styles.P1
          | 1
            attrs
              ..style = styles.gr1
              ..text-style = styles.P2
          | 2
            attrs.style = styles.pr2
          frame-count += 1
        | 'span'
          switch span-count
          | 0
            attrs.style = styles.T1
          span-count += 1
      # fix relative pathes
      attrs.href = "#dir#{attrs.href}" if attrs.href
      attrs
    done tree
  each: !(book-json, onNode, parents = []) ~>
    old-parents = slice.call parents
    for k, v of book-json
      parents.push k
      switch
      | k is "@attributes" => # do nothing
      | isString v         => # do nothing
      | isPlainObject v
        onNode v, k, slice.call old-parents
        utils.each v, onNode, parents
      | isArray v
        for idx, obj of v
          onNode obj, k, slice.call old-parents
          utils.each obj, onNode, parents if not isString obj
      | otherwise
        throw new Error 'ill formated JSON'
      parents.pop!
  map:   (book-json, onNode, parents = []) ~>
    nodes = []
    old-parents = slice.call parents
    for k, v of book-json
      parents.push k
      switch
      | k is "@attributes" => # do nothing
      | isString v         =>
        nodes.push do
          tag-name:  k
          text:      v
      | isPlainObject v
        #console.log k, JSON.stringify v
        nodes.push do
          tag-name: k
          attrs:    onNode v, k, slice.call old-parents
          children: utils.map v, onNode, parents
      | isArray v
        for idx, obj of v
          nodes.push if isString obj
            tag-name: \span
            text:     obj
          else
            tag-name: k
            attrs:    onNode obj, k, slice.call old-parents
            children: utils.map obj, onNode, parents
      | otherwise
        throw new Error 'ill formated JSON'
      parents.pop!
    nodes

(this.ODP ?= {}) <<< utils

