React = require 'react'
Book  = require './Book'

{ div, span } = React.DOM
{ onClick } = require './CUBE/utils'

Reader = React.createClass do
  displayName: 'CUBE.Reader'
  getDefaultProps: ->
    width: 1024
    height: 768
  getInitialState: ->
    page: 1
  render: ->
    { setup } = @props.master-page
    width = if @props.width / @props.height > setup.ratio
      then @props.height * setup.ratio
      else @props.width
    height = if @props.width / @props.height < setup.ratio
      then @props.width / setup.ratio
      else @props.height
    page-count = @props.data.children.length
    div do
      className: 'reader'
      style: { width, height }
      Book @props <<< { ref: 'book', width, height }
      div do
        className: 'navbar'
      div do
        className: "prev #{if @state.page is 1 then 'hidden' else ''}"
        "#onClick": ~>
          --@state.page
          @state.page = 1 if @state.page < 1
          @refs.book["page#{@state.page}"].go!
          @setState page: @state.page
        span!
      div do
        className: "next #{if @state.page is page-count then 'hidden' else ''}"
        "#onClick": ~>
          ++@state.page
          @state.page = page-count if @state.page > page-count
          @refs.book["page#{@state.page}"].go!
          @setState page: @state.page
        span!

module.exports = Reader
