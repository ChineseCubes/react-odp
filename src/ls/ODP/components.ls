{div} = React.DOM

NullMixin =
  render: -> div!

toUpperCamel = ->
  it
    .split '-'
    .map -> "#{it.slice(0, 1).toUpperCase!}#{it.slice(1)}"
    .join ''

ODPElementMixin =
  getDefaultProps: ->
    value:    {}
    children: []
  render: ->
    children = for let i, child of @props.children
      comp = default-components[toUpperCamel child.name]
      if comp
        comp do
          key: i
          value:    child.value
          children: child.children
      else
        null
    v = @props.value
    div do
      className: "element #{@state.name or \unknown}"
      style:
        left:   v.x
        top:    v.y
        width:  v.width
        height: v.height
      children

default-components =
  Page: React.createClass do
    displayName: \ReactODP.Page
    mixins: [ODPElementMixin]
    getInitialState: ->
      name: 'page'
  Frame: React.createClass do
    displayName: \ReactODP.Frame
    mixins: [ODPElementMixin]
    getInitialState: ->
      name: 'frame'

ODP =
  Viewer: React.createClass do
    displayName: \ReactODP.Viewer
    mixins: [ODPElementMixin]
    getInitialState: ->
      name: 'react-odp-viewer'

(this.ODP ?= {}) <<< ODP

