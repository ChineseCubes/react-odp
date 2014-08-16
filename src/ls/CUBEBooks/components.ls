{div} = React.DOM

NullMixin =
  render: -> div!

components =
  Page: React.createClass do
    displayName: \CUBEBooks.Page
    #mixins: [NullMixin]
    getDefaultProps: ->
      width:  640
      height: 480
    render: ->
      children = for let i, child of @props.data.children
        switch
        | child.name is 'frame'
          components.Frame do
            key: i
            data: child
        | otherwise
          div do
            key: i
      div do
        className: 'cubebooks page'
        style:
          width:  @props.width
          height: @props.height
        children
  Frame: React.createClass do
    displayName: \CUBEBooks.Frame
    #mixins: [NullMixin]
    render: ->
      div do
        className: 'cubebooks frame'
        style:
          left:   "#{@props.data.value.x}%"
          top:    "#{@props.data.value.y}%"
          width:  "#{@props.data.value.width}%"
          height: "#{@props.data.value.height}%"

(this.CUBEBooks ?= {}) <<< components

