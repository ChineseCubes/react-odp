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
    value:    {}
    children: []
  render: ->
    v = @props.value
    children = for let i, child of @props.children
      comp = default-components[@toUpperCamel child.name]
      # passing the text-style down
      child.value <<< text-style: v.text-style if v.text-style
      props =
        key: i
        scale:    @props.scale
        name:     child.name
        value:    child.value
        text:     child.text
        children: child.children
      if comp then comp props else null
    classNames = @props.classNames.concat (@props.name or \unknown)
    props =
      className: classNames.join ' '
      style:
        left:      @scaleStyle v.x      or \auto
        top:       @scaleStyle v.y      or \auto
        width:     @scaleStyle v.width  or \auto
        height:    @scaleStyle v.height or \auto
        font-size:  @scaleStyle \44pt
    props.style <<< background-image: "url(#{v.href})" if v.href
    React.DOM[@state.tagName] props, @props.text, children

default-components =
  Page: React.createClass do
    displayName: \ReactODP.Page
    mixins: [DrawMixin]
    getInitialState: ->
      tagName: \div
  Frame: React.createClass do
    displayName: \ReactODP.Frame
    mixins: [DrawMixin]
    getInitialState: ->
      tagName: \div
  TextBox: React.createClass do
    displayName: \ReactODP.TextBox
    mixins: [DrawMixin]
    getInitialState: ->
      tagName: \div
  Image: React.createClass do
    displayName: \ReactODP.Image
    mixins: [DrawMixin]
    getInitialState: ->
      tagName: \img
  P: React.createClass do
    displayName: \ReactODP.P
    mixins: [DrawMixin]
    getInitialState: ->
      tagName: \p
  Span: React.createClass do
    displayName: \ReactODP.P
    mixins: [DrawMixin]
    getInitialState: ->
      tagName: \span
  Presentation: React.createClass do
    displayName: \ReactODP.Presentation
    mixins: [DrawMixin]
    getInitialState: ->
      tagName: \div

(this.ODP ?= {}) <<< default-components

