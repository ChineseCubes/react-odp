React = require 'react'
{ camelFromHyphenated }  = require '../CUBE/utils'
{
  isArray, isString, isNumber,
  filter, map, mapValues, cloneDeep
} = require 'lodash'

scale-length = (scale, value, key = '') -> # without changing the unit
  | key in <[opacity]>         => value
  | isNumber value             => value * scale
  | /^-?\d*\.?\d+%$/test value => value
  | r = /^(-?\d*\.?\d+)(in|cm|mm|px|pc|pt)?$/exec value
    "#{+r.1 * scale}#{r.2 or ''}"
  | otherwise                  => value
renderProps = ->
  default-components[camelFromHyphenated it.data.name]? it
doTextareaVerticalAlign = ->
  return if not it?attrs?style?textarea-vertical-align
  style= it.attrs.style
  for let i, child of it.children
    # pass the style one level down
    (child.attrs.style ?= {}) <<< if it.name is \frame
      #display: \table
      textarea-vertical-align: style.textarea-vertical-align
    # change children into inline-blocks
    #else
    #  display: \inline-block
    #  vertical-align: style.textarea-vertical-align
  it
from-vertical-align = ->
  switch it
  | \top    => \flex-start
  | \middle => \center
  | \bottom => \flex-end
  | _       => \flex-start
doVerticalAlign = ->
  return if it?name is \frame
  attrs = it?attrs
  return if not attrs?style?textarea-vertical-align
  attrs.className = "aligned #{attrs.style.textarea-vertical-align}"
  /**
  it.children.unshift do
    name: 'vertical-aligner'
    namespace: 'helper'
    attrs:
      style:
        display: \inline-block
        height:  \100%
        vertical-align: style.textarea-vertical-align
    children: []
  /**/
  it
removeLineHeight = ->
  delete it?attrs?style?line-height
  it
makeInteractive = ->
  if it?attrs?onClick
    it.attrs.style?cursor = 'pointer'
  it

DrawMixin =
  scaleStyle: (value, key) -> scale-length @props.scale, value, key
  getDefaultProps: ->
    defaultHtmlTag: 'div'
    scale:          1.0
    parents:        []
    renderProps: renderProps
  applyMiddlewares: ->
    if isArray @middlewares then for f in @middlewares => f it
  componentWillMount: -> @applyMiddlewares @props.data
  componentWillReceiveProps: ({data}) -> @applyMiddlewares data
  render: ->
    return if not data = @props.data
    attrs = data.attrs
    return React.DOM.div {} if attrs?style?display is \none and attrs.href
    style =
      left:   attrs?x      or \auto
      top:    attrs?y      or \auto
      width:  attrs?width  or \auto
      height: attrs?height or \auto
    style <<<< attrs?style # import all
    style = mapValues style, @scaleStyle
    # TODO:
    #style = mapValues style, (v, k) ~> v?split(/\s+/)map(~> @scaleStyle it, k)join ' '
    style <<< background-image: "url(#{attrs.href})" if attrs.href
    props =
      className: "#{data.namespace} #{data.name} #{attrs.className or ''}"
      style: style
    for key, attr of attrs => props[key] = attr if /^on.*$/test key
    child-props-list = for let i, child of data.children
      key:     i
      scale:   @props.scale
      parents: @props.parents.concat [tag: data.name, name: attrs.name]
      data:    cloneDeep child
      renderProps: @props.renderProps
    children = child-props-list
      |> map _, @props.renderProps
      |> filter
    children.unshift data.text if data.text
    React.DOM[@props.htmlTag or @props.defaultHtmlTag] do
      props
      children.concat @props.children

# act like React.DOM at v0.12
default-components =
  page: React.createFactory React.createClass do
    displayName: \ReactODP.Page
    mixins: [DrawMixin]
    middlewares: [doTextareaVerticalAlign, doVerticalAlign]
  frame: React.createFactory React.createClass do
    displayName: \ReactODP.Frame
    mixins: [DrawMixin]
    middlewares: [doTextareaVerticalAlign, removeLineHeight]
  text-box: React.createFactory React.createClass do
    displayName: \ReactODP.TextBox
    mixins: [DrawMixin]
    middlewares: [doTextareaVerticalAlign, doVerticalAlign]
  image: React.createFactory React.createClass do
    displayName: \ReactODP.Image
    mixins: [DrawMixin]
    middlewares: [doTextareaVerticalAlign, doVerticalAlign, makeInteractive]
  p: React.createFactory React.createClass do
    displayName: \ReactODP.P
    mixins: [DrawMixin]
    middlewares: [doTextareaVerticalAlign, doVerticalAlign, removeLineHeight]
  span: React.createFactory React.createClass do
    displayName: \ReactODP.Span
    mixins: [DrawMixin]
    middlewares: [doTextareaVerticalAlign, doVerticalAlign, makeInteractive]
  line-break: React.createFactory React.createClass do
    displayName: \ReactODP.LineBreak
    mixins: [DrawMixin]
    getDefaultProps: ->
      htmlTag: \br
  presentation: React.createFactory React.createClass do
    displayName: \ReactODP.Presentation
    mixins: [DrawMixin]
  vertical-aligner: React.createFactory React.createClass do
    displayName: \ReactODP.VerticalAligner
    mixins: [DrawMixin]
    getDefaultProps: ->
      htmlTag: \span

module.exports =
  DrawMixin:   DrawMixin
  components:  default-components
  renderProps: renderProps
  scale-length: scale-length

