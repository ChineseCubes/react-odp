React = require 'react'

{ scale-length } = require '../ODP'
{ svg, path } = React.DOM

CustomShape = module.exports = React.createClass do
  getDefaultProps: ->
    data: null
  render: ->
    { scale } = @props
    { width, height, x, y } = @props.data.attrs
    { viewbox, enhanced-path } = @props.data.children.1.attrs.style
    width  = scale-length scale, width
    height = scale-length scale, height
    x = scale-length scale, x
    y = scale-length scale, y
    svg do
      className: 'enhanced-geometry'
      view-box: viewbox
      width:  width
      height: height
      preserve-aspect-ratio: 'none meet'
      style:
        #width:  width
        #height: height
        left: x
        top:  y
      path do
        fill: \#fff
        d: enhanced-path
