require! {
  react: React
  lodash: { isArray, isString, isNumber, filter, map, mapValues, cloneDeep }
  '../CUBE/utils': { camelFromHyphenated }
}

###
# Helpers
scale-length = (scale, value, key = '') --> # without changing the unit
  | key in <[opacity]>         => value
  | isNumber value             => value * scale
  | /^-?\d*\.?\d+%$/test value => value
  | r = /^(-?\d*\.?\d+)(in|cm|mm|px|pc|pt)?$/exec value
    "#{+r.1 * scale}#{r.2 or ''}"
  | otherwise                  => value

# TODO: might be useful someday
#style = mapValues style, (v, k) ~>
#  v?split(/\s+/)map(~> @scaleStyle it, k)join ' '

remove-line-height = ({ props }:it) ->
  delete props?style?line-height
  it

make-interactive = ({ props }:it) ->
  props.style?cursor = \pointer if props?onClick
  it

scale-everything = ({ props }:it) ->
  props.style = mapValues ({} <<< props.style), (scale-length props.scale)
  it

set-image-href = ({ props }:it)->
  if props.href
    props.style.background-image = "url(#{props.href})"
  it

###
# Mixin
mixin =
  getDefaultProps: ->
    scale:    1.0
    namepath: []
  doRender: ->
    React.DOM[@props.htmlTag or \div] @props

###
# Default Components
components =
  undefined: {}
  office:
    presentation: React.createFactory React.createClass do
      displayName: \ReactODP.Presentation
      mixins: [mixin]
      render: ->
        this |> scale-everything
        @doRender!
  draw:
    page: React.createFactory React.createClass do
      displayName: \ReactODP.Page
      mixins: [mixin]
      render: ->
        this
        |> scale-everything
        @doRender!
    frame: React.createFactory React.createClass do
      displayName: \ReactODP.Frame
      mixins: [mixin]
      render: ->
        this
        |> scale-everything
        |> remove-line-height
        @doRender!
    text-box: React.createFactory React.createClass do
      displayName: \ReactODP.TextBox
      mixins: [mixin]
      render: ->
        this
        |> scale-everything
        @doRender!
    image: React.createFactory React.createClass do
      displayName: \ReactODP.Image
      mixins: [mixin]
      render: ->
        this
        |> scale-everything
        |> set-image-href
        |> make-interactive
        @doRender!
  text:
    vertical-aligner: React.createFactory React.createClass do
      displayName: \ReactODP.VerticalAligner
      mixins: [mixin]
      getDefaultProps: ->
        htmlTag: \span
      render: ->
        this |> scale-everything
        @doRender!
    p: React.createFactory React.createClass do
      displayName: \ReactODP.P
      mixins: [mixin]
      render: ->
        this
        |> scale-everything
        |> remove-line-height
        @doRender!
    span: React.createFactory React.createClass do
      displayName: \ReactODP.Span
      mixins: [mixin]
      render: ->
        this
        |> scale-everything
        |> make-interactive
        @doRender!
    line-break: React.createFactory React.createClass do
      displayName: \ReactODP.LineBreak
      mixins: [mixin]
      getDefaultProps: ->
        htmlTag: \br
      render: ->
        this |> scale-everything
        @doRender!

lookup = (node) -> components[node.namespace]?[camelFromHyphenated node.name]
render = (node, scale = 1.0, getComponent = lookup, namepath = []) ->
  | not node => null
  | otherwise
    # clone props w/o cloning the children
    props = cloneDeep node.attrs
    props
      ..className = "#{node.namespace} #{node.name} #{props.className or ''}"
      ..scale = scale
      ..namepath = namepath ++ [node.name]
    children = for i, c of node.children
      c.attrs.ref = i
      render c, scale, getComponent, namepath
    children.push node.text if node.text
    comp = getComponent node
    comp? props, children
register = (namespace, name, comp) ->
  components[namespace]?[name]? = comp

module.exports = {
  scale-length
  mixin
  render
  register
}

