React = require 'react'

{ div, i } = React.DOM
{ onClick } = require './utils'

UndoCut = React.createClass do
  displayName: 'CUBE.UndoCut'
  getDefaultProps: ->
    actived: no
  render: ->
    actived = if @props.actived then 'actived' else ''
    div do
      className: 'comp undo-cut ui black icon buttons'
      div do
        className: "ui button #actived"
        "#onClick": @props."#onClick"
        i className: 'repeat icon'

module.exports = UndoCut
