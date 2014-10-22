React = require 'react'
Button = require './Button'

{ div } = React.DOM
{ onClick } = require '../utils'

Menu = React.createClass do
  displayName: 'CUBE.UI.Menu'
  getDefaultProps: ->
    buttons: []
    onButtonClick: -> ...
  render: ->
    @transferPropsTo div do
      className: 'menu'
      div do
        className: 'buttons'
        for let idx, btn of @props.buttons
          Button do
            key: idx
            className: btn
            "#onClick": ~>
              it.stopPropagation!
              @props.onButtonClick.apply this, [btn] ++ arguments

module.exports = Menu
