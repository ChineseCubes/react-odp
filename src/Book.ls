React        = require 'react'
Presentation = require './Presentation'

{ div } = React.DOM

Book = React.createClass do
  displayName: \Book
  getDefaultProps: ->
    data: null
    scale: 0.9676190207042399 # magic
  render: ->
    div do
      className: 'book'
      Presentation.render @props.data, @props.scale

module.exports = Book

