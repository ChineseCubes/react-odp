React = require 'react'

{ dl, dt, dd } = React.DOM

Definition = React.createClass do
  className: 'CUBE.Book.Definition'
  getDefaultProps: ->
    word: null
    definition: null
  render: ->
    className = "definition #{@props.className}"
    dl do
      @props <<< { className }
      if @props.word and @props.definition
        * dt {}, @props.word
          dd {}, @props.definition

module.exports = Definition
