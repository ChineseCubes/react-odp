React = require 'react'
Book  = require './Book'

{ div, span } = React.DOM
{ onClick } = require './CUBE/utils'

Reader = React.createClass do
  displayName: 'CUBE.Reader'
  getInitialState: ->
    page: 1
  render: ->
    page-count = @props.data.children.length
    div do
      className: 'reader'
      Book @props <<< ref: 'book'
      div do
        className: 'menu'
      div do
        className: "prev #{if @state.page is 1 then 'hidden' else ''}"
        "#onClick": ~>
          --@state.page
          @state.page = 1 if @state.page < 1
          @refs.book["page#{@state.page}"].go!
          @setState page: @state.page
        span {} '上一頁'
      div do
        className: "next #{if @state.page is page-count then 'hidden' else ''}"
        "#onClick": ~>
          ++@state.page
          @state.page = page-count if @state.page > page-count
          @refs.book["page#{@state.page}"].go!
          @setState page: @state.page
        span {} '下一頁'

module.exports = Reader
