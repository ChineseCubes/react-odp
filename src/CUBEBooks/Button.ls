React = require 'react'

{ div } = React.DOM

Button = React.createClass do
  displayName: 'CCUI.Button'
  render: ->
    @transferPropsTo div do
      className: 'button'
      div {}, @props.children

module.exports = Button
