React = require 'react'

{ div, span } = React.DOM

Definition = React.createClass do
  className: 'CCUI.Definition'
  getDefaultProps: ->
    word: null
    definition: null
  render: ->
    @transferPropsTo div do
      className: 'definition'
      if @props.word and @props.definition
        * span do
            className: 'word'
            @props.word
          span do
            className: 'translation'
            @props.definition

module.exports = Definition
