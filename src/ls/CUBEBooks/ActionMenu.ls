React = require 'react'

{ div, i } = React.DOM
{ onClick } = require './utils'

ActionMenu = React.createClass do
  icon: ->
    | it is \stroke  => \pencil
    | it is \cut     => \cut
    | it is \pinyin  => "volume up"
    | it is \english => \font
    | otherwise      => \question
  displayName: 'CUBE.ActionMenu'
  getDefaultProps: ->
    buttons: <[cut]>
    disabled: [no]
    onChange: -> ...
  getInitialState: ->
    actived = []
    for i of @props.buttons
      actived[i] = false
    actived: actived
  render: ->
    buttons = @props.buttons
    type = if buttons.length is 1 then 'single' else 'multiple'
    div do
      className: "actions #{@props.className}"
      div do
        className: "menu #type"
        div do
          className: 'ui buttons'
          #div do
          #  className: 'ui icon button black listen'
          #  i className: 'icon volume up'
          for let idx, btn of buttons
            actived = if @state.actived[idx] then 'actived' else ''
            disabled = if @props.disabled[idx] then 'disabled' else ''
            div do
              key: "button-#idx"
              className: "ui icon button black #actived #disabled"
              "#onClick": ~>
                it.stopPropagation!
                @setState actived:
                  for i from 0 til @state.actived.length
                    # exclude
                    actived = if i is +idx
                      then !@state.actived[i]
                      else off
                    @props.onChange.call this, it, buttons[i], actived, ~>
                      @state.actived[idx] = off
                      @setState actived: @state.actived
                    actived
              i className: "icon #{@icon btn}"

module.exports = ActionMenu
