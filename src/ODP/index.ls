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
  default-components[camelFromHyphenated it.data.namespace]?[camelFromHyphenated it.data.name]? it
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
    scale:          1.0
    parents:        []
    renderProps: renderProps
  applyMiddlewares: ->
    if isArray @middlewares then for f in @middlewares => f it
  #componentWillMount: -> @applyMiddlewares @props.data
  #componentWillReceiveProps: ({data}) -> @applyMiddlewares data
  render: ->
    return React.DOM.div {} if @props.style?display is \none and attrs.href
    @props.style = mapValues ({} <<<< @props.style), @scaleStyle
    # TODO: might be useful someday
    #style = mapValues style, (v, k) ~> v?split(/\s+/)map(~> @scaleStyle it, k)join ' '
    @props.style <<< background-image: "url(#{@props.href})" if @props.href
    React.DOM[@props.htmlTag or \div] @props

# act like React.DOM at v0.12
default-components =
  office:
    presentation: React.createFactory React.createClass do
      displayName: \ReactODP.Presentation
      mixins: [DrawMixin]
  draw:
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
  text:
    vertical-aligner: React.createFactory React.createClass do
      displayName: \ReactODP.VerticalAligner
      mixins: [DrawMixin]
      getDefaultProps: ->
        htmlTag: \span
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

lookup = (node) -> default-components[node.namespace]?[node.name]
render = (node, scale = 1.0, getComponent = lookup) ->
  | not node => null
  | otherwise
    # clone props w/o cloning the children
    props = cloneDeep node.attrs
    props.scale = scale
    props.className = "#{node.namespace} #{node.name} #{props.className or ''}"
    children = for i, c of node.children
      c.attrs.ref = i
      render c, scale, getComponent
    children.push node.text if node.text
    comp = getComponent node
    comp? props, children

module.exports =
  DrawMixin:    DrawMixin
  components:   default-components
  renderProps:  renderProps
  scale-length: scale-length
  render:       render

