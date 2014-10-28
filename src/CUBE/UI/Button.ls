React = require 'react'

{ div } = React.DOM

Button = React.createClass do
  displayName: 'CUBE.UI.Button'
  render: ->
    className = "button #{@props.className}"
    div do
      @props <<< { className }
      div {}, @props.children

module.exports = Button
