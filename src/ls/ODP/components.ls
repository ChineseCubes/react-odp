{div}      = React.DOM
{isNumber} = _

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
    | not it               => it
    | isNumber it          => it * @props.scale
    | /\d*\.?\d+%$/test it => it
    | r = /(\d*\.?\d+)(in|cm|mm|px|pc|pt)?$/exec it
      "#{+r.1 * @props.scale}#{r.2 or ''}"
    | otherwise
      throw new Error "style \"#it\" should be a length"
  getDefaultProps: ->
    classNames: <[draw]>
    scale:    1.0
    children: []
  render: ->
    children = for let i, child of @props.children
      comp = default-components[@toUpperCamel child.tag-name]
      if comp
        # passing the text-style down
        child.attrs <<< text-style: @props.text-style if @props.text-style
        props =
          key:      i
          tag-name: child.tag-name
          text:     child.text
          scale:    @props.scale
          children: child.children
        props <<< child.attrs
        comp props
    classNames = @props.classNames.concat (@props.tag-name or \unknown)
    props =
      className: classNames.join ' '
      style:
        left:        @scaleStyle @props.x         or \auto
        top:         @scaleStyle @props.y         or \auto
        width:       @scaleStyle @props.width     or \auto
        height:      @scaleStyle @props.height    or \auto
        font-size:   @scaleStyle @props.font-size or \44pt
        font-family: @props.style?font-family
    props.style <<< background-image: "url(#{@props.href})" if @props.href
    React.DOM[@state.tag] props, @props.text, children

default-components =
  Page: React.createClass do
    displayName: \ReactODP.Page
    mixins: [DrawMixin]
    getInitialState: ->
      tag: \div
  Frame: React.createClass do
    displayName: \ReactODP.Frame
    mixins: [DrawMixin]
    getInitialState: ->
      tag: \div
  TextBox: React.createClass do
    displayName: \ReactODP.TextBox
    mixins: [DrawMixin]
    getInitialState: ->
      tag: \div
  Image: React.createClass do
    displayName: \ReactODP.Image
    mixins: [DrawMixin]
    getInitialState: ->
      tag: \img
  P: React.createClass do
    displayName: \ReactODP.P
    mixins: [DrawMixin]
    getInitialState: ->
      tag: \p
  Span: React.createClass do
    displayName: \ReactODP.P
    mixins: [DrawMixin]
    getInitialState: ->
      tag: \span
  Presentation: React.createClass do
    displayName: \ReactODP.Presentation
    mixins: [DrawMixin]
    getInitialState: ->
      tag: \div

(this.ODP ?= {}) <<< default-components

