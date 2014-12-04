React       = require 'react'
NotifyMixin = require '../NotifyMixin'

{ div } = React.DOM

Button = React.createClass do
  displayName: 'CUBE.UI.Button'
  mixins: [NotifyMixin]
  render: ->
    className = "button #{@props.className}"
    { style } = @props
    click = @props.onClick
    div do
      @props <<< { className, style, onClick: ~> click ... }
      div {}, @props.children

module.exports = Button
