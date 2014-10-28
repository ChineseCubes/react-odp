React = require 'react'

{ div, span } = React.DOM

Popup = React.createClass do
  displayName: 'CUBE.UI.Popup'
  render: ->
    className = "popup #{@props.class}"
    div do
      @props <<< { className }
      span {}, @props.children

module.exports = Popup
