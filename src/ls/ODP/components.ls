{isString, isNumber, filter, map, mapValues, cloneDeep} = _
{span} = React.DOM

camelFromHyphenated = ->
  it
    .split '-'
    .map (v, i) ->
      | i is 0  => v
      | otherwise =>"#{v.slice(0, 1)toUpperCase!}#{v.slice(1)}"
    .join ''
renderProps =
  (props) -> default-components[camelFromHyphenated props.data.name]? props

DrawMixin =
  scaleStyle: (value, key) -> # without changing the unit
    | key in <[opacity]>      => value
    | isNumber value          => value * @props.scale
    | /\d*\.?\d+%$/test value => value
    | r = /(\d*\.?\d+)(in|cm|mm|px|pc|pt)?$/exec value
      "#{+r.1 * @props.scale}#{r.2 or ''}"
    | otherwise               => value
  getDefaultProps: ->
    defaultHtmlTag: 'div'
    classNames:     <[draw]>
    scale:          1.0
    parents:        []
    renderProps: renderProps
  render: ->
    return if not data = @props.data
    attrs = data.attrs
    style =
      left:   attrs?x      or \auto
      top:    attrs?y      or \auto
      width:  attrs?width  or \auto
      height: attrs?height or \auto
    style <<<< attrs?style # import all
    delete style.line-height # FIXME
    style = mapValues style, @scaleStyle
    style <<< background-image: "url(#{attrs.href})" if attrs.href
    props =
      className: @props.classNames.concat (data.name or \unknown) .join ' '
      style: style
    # FIXME: should not hard coded here
    if isString attrs.onclick
      props
        ..style.cursor = 'pointer'
        ..onClick = ~> alert attrs.onclick
    child-props-list = for let i, child of data.children
      throw new Error 'unknow tag name' if not child.name
      props =
        key:         i
        scale:       @props.scale
        parents:     @props.parents.concat [data.name]
        data:        cloneDeep child
        renderProps: @props.renderProps
      ###
      # special rules for vertical-align
      ###
      if style.textarea-vertical-align
        # pass the style one level down
        (props.data.attrs.style ?= {}) <<< if data.name is \frame
          textarea-vertical-align: style.textarea-vertical-align
        # change children into inline-blocks
        else
          display:        \inline-block
          vertical-align: style.textarea-vertical-align
      ###
      props
    children = child-props-list
      |> map _, @props.renderProps
      |> filter
    ###
    # special rules for vertical-align
    ###
    if data.name isnt \frame and style.textarea-vertical-align
      children.unshift span do
        key: \-1
        style:
          display:        \inline-block
          height:         \100%
          vertical-align: style.textarea-vertical-align
    ###
    if data.text
      children.unshift data.text
    React.DOM[@props.htmlTag or @props.defaultHtmlTag] props, children

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
    getDefaultProps: ->
      htmlTag: \p
  span: React.createClass do
    displayName: \ReactODP.Span
    mixins: [DrawMixin]
    getDefaultProps: ->
      htmlTag: \span
  # FIXME: does not work in FireFox when the element are not at the same level
  # of other elements
  line-break: React.createClass do
    displayName: \ReactODP.LineBreak
    mixins: [DrawMixin]
    getDefaultProps: ->
      htmlTag: \br
  presentation: React.createClass do
    displayName: \ReactODP.Presentation
    mixins: [DrawMixin]

(this.ODP ?= {}) <<< do
  mixin: DrawMixin
  components: default-components
  camelFromHyphenated: camelFromHyphenated
  renderProps: renderProps
  renderComponent: (data, element) ->
    React.renderComponent do
      default-components.presentation data: data
      element

