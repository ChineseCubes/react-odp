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

utils =
  DotsDetector: DotsDetector
  getPageJSON: !(path, done) ->
    [,dir] = /(.*\/)?.*\.json/exec(path) or [,'']
    data <- $.getJSON path
    data['@attributes'] <<< do
      x:      \0
      y:      \0
      width:  \28cm
      height: \21cm
    data = page: data
    tree = utils.map data, ->
      r = it['@attributes'] or []
      r.href = "#dir#{r.href}" if r.href
      r
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
          utils.each obj, onNode, parents
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
      | isString v         => # do nothing
      | isPlainObject v
        nodes.push do
          name:     k
          value:    onNode v, k, slice.call old-parents
          children: utils.map v, onNode, parents
      | isArray v
        for idx, obj of v
          nodes.push do
            name:     k
            value:    onNode obj, k, slice.call old-parents
            children: utils.map obj, onNode, parents
      | otherwise
        throw new Error 'ill formated JSON'
      parents.pop!
    nodes

(this.ODP ?= {}) <<< utils

