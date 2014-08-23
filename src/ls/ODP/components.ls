{isNumber, mapValues} = _
{span} = React.DOM

NullMixin =
  render: -> div!

DrawMixin =
  toHyphen: ->
  lowerCamelFromHyphenated: ->
    it
      .split '-'
      .map (v, i) ->
        | i is 0  => v
        | otherwise =>"#{v.slice(0, 1)toUpperCase!}#{v.slice(1)}"
      .join ''
  scaleStyle: (value, key) -> # without changing the unit
    | key in <[opacity]>      => value
    | isNumber value          => value * @props.scale
    | /\d*\.?\d+%$/test value => value
    | r = /(\d*\.?\d+)(in|cm|mm|px|pc|pt)?$/exec value
      "#{+r.1 * @props.scale}#{r.2 or ''}"
    | otherwise               => value
  getDefaultProps: ->
    components: {}
    classNames: <[draw]>
    scale:    1.0
    children: []
  getInitialState: ->
    default-html-tag: \div
  render: ->
    ##
    # prepare self
    classNames = @props.classNames.concat (@props.name or \unknown)
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
      throw new Error 'unknow tag name' if not child.name
      return child.text if child.text
      (comps = ^^default-components) <<< @props.components
      comp = comps[@lowerCamelFromHyphenated child.name]
      if comp
        props =
          key:        i
          scale:      @props.scale
          components: @props.components
          name:       child.name
          text:       child.text
          children:   child.children
        delete child.attrs.name
        props <<< child.attrs
        ##
        # deal with (.*-)?vertical-align
        if style.textarea-vertical-align
          # pass the style one level down
          (props.style ?= {}) <<< if @props.name is \frame
            textarea-vertical-align: style.textarea-vertical-align
          # change children into inline-blocks
          else
            display:        \inline-block
            vertical-align: style.textarea-vertical-align
        comp props
    # then add an invisible element to fill the height
    if @props.name isnt \frame and style.textarea-vertical-align
      children.unshift span do
        key: \-1
        style:
          display:        \inline-block
          height:         \100%
          vertical-align: style.textarea-vertical-align
    if @props.text
      children.unshift @props.text
    React.DOM[@state.html-tag or @state.default-html-tag] do
      props
      children

default-components =
  page: React.createClass do
    displayName: \ReactODP.Page
    mixins: [DrawMixin]
  frame: React.createClass do
    displayName: \ReactODP.Frame
    mixins: [DrawMixin]
  text-box: React.createClass do
    displayName: \ReactODP.TextBox
    mixins: [DrawMixin]
  image: React.createClass do
    displayName: \ReactODP.Image
    mixins: [DrawMixin]
  p: React.createClass do
    displayName: \ReactODP.P
    mixins: [DrawMixin]
    getInitialState: ->
      html-tag: \p
  span: React.createClass do
    displayName: \ReactODP.Span
    mixins: [DrawMixin]
    getInitialState: ->
      html-tag: \span
  # FIXME: does not work in FireFox when the element are not at the same level
  # of other elements
  line-break: React.createClass do
    displayName: \ReactODP.LineBreak
    mixins: [DrawMixin]
    getInitialState: ->
      html-tag: \br
  presentation: React.createClass do
    displayName: \ReactODP.Presentation
    mixins: [DrawMixin]

(this.ODP ?= {}) <<< do
  DrawMixin: DrawMixin
  renderComponent: (data, element) ->
    React.renderComponent do
      default-components.presentation data
      element

