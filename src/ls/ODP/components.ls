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
  scaleStyle: (value, key) -> # without changing the unit
    | key in <[opacity]>      => value
    | isNumber value          => value * @props.scale
    | /\d*\.?\d+%$/test value => value
    | r = /(\d*\.?\d+)(in|cm|mm|px|pc|pt)?$/exec value
      "#{+r.1 * @props.scale}#{r.2 or ''}"
    | otherwise               => value
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
    style = mapValues style, @scaleStyle
    style <<< background-image: "url(#{@props.href})" if @props.href
    props =
      className: classNames.join ' '
      style: style
    ##
    # prepare children
    children = for let i, child of @props.children
      return child.text if child.text
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
        # FIXME: does not work in FireFox
        if style.textarea-vertical-align and child.tag-name is \text-box
          (props.style ?= {}) <<< do
            display:                 \table
            textarea-vertical-align: style.textarea-vertical-align
        if @props.tag-name is 'text-box' and style.display is \table
          (props.style ?= {}) <<< do
            display:        \table-cell
            vertical-align: style.textarea-vertical-align
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
    displayName: \ReactODP.Span
    mixins: [DrawMixin]
    getInitialState: ->
      html-tag: \span
  # FIXME: does not work in FireFox when the element are not at the same level
  # of other elements
  LineBreak: React.createClass do
    displayName: \ReactODP.LineBreak
    mixins: [DrawMixin]
    getInitialState: ->
      html-tag: \br
  Presentation: React.createClass do
    displayName: \ReactODP.Presentation
    mixins: [DrawMixin]

(this.ODP ?= {}) <<< default-components

