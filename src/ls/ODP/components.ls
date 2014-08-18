{div}      = React.DOM
{isNumber} = _

NullMixin =
  render: -> div!

DrawMixin =
  toHyphen: ->
  toUpperCamel: ->
    it
      .split '-'
      .map -> "#{it.slice(0, 1).toUpperCase!}#{it.slice(1)}"
      .join ''
  scaleStyle: -> # without changing the unit
    | not it               => it
    | isNumber it          => it * @props.scale
    | /\d*\.?\d+%$/test it => it
    | r = /(\d*\.?\d+)(in|cm|mm|px|pc|pt)?$/exec it
      "#{+r.1 * @props.scale}#{r.2 or ''}"
    | otherwise
      throw new Error "style \"#it\" should be a length"
  getDefaultProps: ->
    scale:    1.0
    value:    {}
    children: []
  render: ->
    children = for let i, child of @props.children
      comp = default-components[@toUpperCamel child.name]
      if comp
        comp do
          key: i
          scale:    @props.scale
          value:    child.value
          children: child.children
      else
        null
    v = @props.value
    div do
      className: "draw #{@state.name or \unknown}"
      style:
        left:   @scaleStyle v.x      or \auto
        top:    @scaleStyle v.y      or \auto
        width:  @scaleStyle v.width  or \auto
        height: @scaleStyle v.height or \auto
      children

default-components =
  Page: React.createClass do
    displayName: \ReactODP.Page
    mixins: [DrawMixin]
    getInitialState: ->
      name: 'page'
  Frame: React.createClass do
    displayName: \ReactODP.Frame
    mixins: [DrawMixin]
    getInitialState: ->
      name: 'frame'
  Presentation: React.createClass do
    displayName: \ReactODP.Presentation
    mixins: [DrawMixin]
    getInitialState: ->
      name: 'presentation'

(this.ODP ?= {}) <<< default-components

