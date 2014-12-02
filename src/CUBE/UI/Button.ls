React = require 'react'

{ div } = React.DOM

Button = React.createClass do
  displayName: 'CUBE.UI.Button'
  render: ->
    className = "button #{@props.className}"
    { style } = @props
    div do
      @props <<< { className, style }
      div {}, @props.children

module.exports = Button
