{isArray, isString, isNumber, filter, map, mapValues, cloneDeep} = _
{span} = React.DOM

camelFromHyphenated = ->
  it
    .split '-'
    .map (v, i) ->
      | i is 0  => v
      | otherwise =>"#{v.slice(0, 1)toUpperCase!}#{v.slice(1)}"
    .join ''
renderProps = -> default-components[camelFromHyphenated it.data.name]? it
doTextareaVerticalAlign = ->
  return if not it?attrs?style?textarea-vertical-align
  style= it.attrs.style
  for let i, child of it.children
    # pass the style one level down
    (child.attrs.style ?= {}) <<< if it.name is \frame
      textarea-vertical-align: style.textarea-vertical-align
    # change children into inline-blocks
    else
      display:        \inline-block
      vertical-align: style.textarea-vertical-align
  it
doVerticalAlign = ->
  return if it?name is \frame
  console.log it.name
  return if not it?attrs?style?textarea-vertical-align
  console.log it
  style = it.attrs.style
  it.children.unshift do
    name: 'vertical-aligner'
    attrs:
      style:
        display:        \inline-block
        height:         \100%
        vertical-align: style.textarea-vertical-align
    children: []
  it

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
  componentWillMount: ->
    if isArray @middlewares then for f in @middlewares => f @props.data
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
      props
    children = child-props-list
      |> map _, @props.renderProps
      |> filter
    console.log children
    children.unshift data.text if data.text
    React.DOM[@props.htmlTag or @props.defaultHtmlTag] do
      props
      children.concat @props.children

default-components =
  page: React.createClass do
    displayName: \ReactODP.Page
    mixins: [DrawMixin]
  frame: React.createClass do
    displayName: \ReactODP.Frame
    mixins: [DrawMixin]
    middlewares: [doTextareaVerticalAlign]
  text-box: React.createClass do
    displayName: \ReactODP.TextBox
    mixins: [DrawMixin]
    middlewares: [doTextareaVerticalAlign, doVerticalAlign]
  image: React.createClass do
    displayName: \ReactODP.Image
    mixins: [DrawMixin]
    middlewares: [doTextareaVerticalAlign, doVerticalAlign]
  p: React.createClass do
    displayName: \ReactODP.P
    mixins: [DrawMixin]
    middlewares: [doTextareaVerticalAlign, doVerticalAlign]
    getDefaultProps: ->
      htmlTag: \p
  span: React.createClass do
    displayName: \ReactODP.Span
    mixins: [DrawMixin]
    middlewares: [doTextareaVerticalAlign, doVerticalAlign]
    getDefaultProps: ->
      htmlTag: \span
  line-break: React.createClass do
    displayName: \ReactODP.LineBreak
    mixins: [DrawMixin]
    getDefaultProps: ->
      htmlTag: \br
  presentation: React.createClass do
    displayName: \ReactODP.Presentation
    mixins: [DrawMixin]
  vertical-aligner: React.createClass do
    displayName: \ReactODP.VerticalAligner
    mixins: [DrawMixin]
    getDefaultProps: ->
      htmlTag: \span
    componentWillReceiveProps: ->
      consol.log 'hello'

(this.ODP ?= {}) <<< do
  DrawMixin: DrawMixin
  components: default-components
  camelFromHyphenated: camelFromHyphenated
  renderProps: renderProps

