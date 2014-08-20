{isNumber, mapValues} = _

NullMixin =
  render: -> div!

DrawMixin =
  toHyphen: ->
  toUpperCamel: -> # maybe its not a good idea
    it
      .split '-'
      .map -> "#{it.slice(0, 1).toUpperCase!}#{it.slice(1)}"
      .join ''
  toLowerCamel: ->
    it = @toUpperCamel it
    it.0 = it.0.toLowerCase!
    it
  scaleStyle: -> # without changing the unit
    | isNumber it          => it * @props.scale
    | /\d*\.?\d+%$/test it => it
    | r = /(\d*\.?\d+)(in|cm|mm|px|pc|pt)?$/exec it
      "#{+r.1 * @props.scale}#{r.2 or ''}"
    | otherwise            => it
  getDefaultProps: ->
    classNames: <[draw]>
    scale:    1.0
    children: []
  getInitialState: ->
    default-html-tag: \div
  render: ->
    ##
    # prepare self
    classNames = @props.classNames.concat (@props.tag-name or \unknown)
    # TODO: import, scale, append
    (style = {}) <<<< @props.style # import all
    style <<< do
      left:        @props.x         or \auto
      top:         @props.y         or \auto
      width:       @props.width     or \auto
      height:      @props.height    or \auto
      font-size:   @props.font-size or \44pt
    style = mapValues style, @scaleStyle
    style <<< background-image: "url(#{@props.href})" if @props.href
    if style.vertical-align and style.display isnt 'table-cell'
      style.display = 'table'
    props =
      className: classNames.join ' '
      style: style
    ##
    # prepare children
    children = for let i, child of @props.children
      comp = default-components[@toUpperCamel child.tag-name]
      if comp
        props =
          key:      i
          tag-name: child.tag-name
          text:     child.text
          scale:    @props.scale
          children: child.children
        props <<< child.attrs
        # deal with (.*-)?vertical-align
        if style.textarea-vertical-align and child.tag-name is 'text-box'
          (props.style ?= {}) <<< do
            vertical-align: style.textarea-vertical-align
        if style.vertical-align and style.display isnt 'table-cell'
          console.log child.tag-name
          (props.style ?= {}) <<< do
            display:        'table-cell'
            vertical-align: style.vertical-align
        comp props
    React.DOM[@state.html-tag or @state.default-html-tag] do
      props
      @props.text
      children

default-components =
  Page: React.createClass do
    displayName: \ReactODP.Page
    mixins: [DrawMixin]
  Frame: React.createClass do
    displayName: \ReactODP.Frame
    mixins: [DrawMixin]
  TextBox: React.createClass do
    displayName: \ReactODP.TextBox
    mixins: [DrawMixin]
  Image: React.createClass do
    displayName: \ReactODP.Image
    mixins: [DrawMixin]
    getInitialState: ->
      html-tag: \img
  P: React.createClass do
    displayName: \ReactODP.P
    mixins: [DrawMixin]
    getInitialState: ->
      html-tag: \p
  Span: React.createClass do
    displayName: \ReactODP.P
    mixins: [DrawMixin]
    getInitialState: ->
      html-tag: \span
  Presentation: React.createClass do
    displayName: \ReactODP.Presentation
    mixins: [DrawMixin]

(this.ODP ?= {}) <<< default-components

