React = require 'react'

{ div, span } = React.DOM

Popup = React.createClass do
  displayName: 'CUBE.UI.Popup'
  render: ->
    @transferPropsTo div do
      className: 'popup'
      span {}, @props.children

module.exports = Popup
