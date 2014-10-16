React = require 'react'

{ dl, dt, dd } = React.DOM

Definition = React.createClass do
  className: 'CUBE.Book.Definition'
  getDefaultProps: ->
    word: null
    definition: null
  render: ->
    @transferPropsTo dl do
      className: 'definition'
      if @props.word and @props.definition
        * dt {}, @props.word
          dd {}, @props.definition

module.exports = Definition
