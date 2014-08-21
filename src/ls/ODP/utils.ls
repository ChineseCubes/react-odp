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
    font-family:  'Noto Sans T Chinese'
    font-size:     '30pt'
  ..P8 =
    line-height:   '150%'
    font-size:     '24pt'
  ..P9 =
    line-height:   '150%'
    font-family:  'Noto Sans T Chinese'
    font-size:     '24pt'
  ..T1 =
    font-family:  'Noto Sans T Chinese'
  ..T2 =
    font-family:  'cwTeX Q KaiZH'
  ..T3 =
    font-family:  'Noto Sans T Chinese'
    font-size:     '30pt'
  ..T4 =
    font-family:  'Noto Sans T Chinese'
    font-size:     '24pt'

utils =
  DotsDetector: DotsDetector
  getPageJSON: !(path, done) ->
    data <- $.getJSON path
    data['@attributes'] <<< x: \0 y: \0 width: \28cm height: \21cm
    [, dir] = /(.*\/)?(.*)\.json/exec(path) or [, '']
    done utils.map page: data, ->
      (attrs = it['@attributes'] or {})
        ..style = styles[attrs['style-name']]
        ..text-style = styles[attrs['text-style-name']]
        ..href = "#dir#{attrs.href}" if attrs.href
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
            text: obj
          else
            tag-name: k
            attrs:    onNode obj, k, slice.call old-parents
            children: utils.map obj, onNode, parents
      | otherwise
        throw new Error 'ill formated JSON'
      parents.pop!
    nodes

(this.ODP ?= {}) <<< utils

