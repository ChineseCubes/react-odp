React = require 'react'

{ div, span } = React.DOM

Popup = React.createClass do
  displayName: 'CCUI.Popup'
  render: ->
    @transferPropsTo div do
      className: 'popup'
      span {}, @props.children

module.exports = Popup
