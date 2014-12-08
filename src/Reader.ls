React = require 'react'
Book  = React.createFactory require './Book'

{ div, span } = React.DOM
{ onClick } = require './CUBE/utils'

Reader = React.createClass do
  displayName: 'CUBE.Reader'
  getDefaultProps: ->
    width: 1024
    height: 768
  getInitialState: ->
    page: 0
  componentWillMount: ->
    #history.replaceState @state, \CᴜʙᴇBooks, "?#{@state.page}"
    page = +window.location.search.replace '?', ''
    if page
      @state.page = page
    else
      history.replaceState @state, \CᴜʙᴇBooks, '?0'
    window.onpopstate = ({ state }) ~> @setState state if state
  componentWillUpdate: (_props, _state) ->
    if @state.page isnt _state.page
      # guard
      page-count = @props.data.children.length
      _state.page = (page-count + _state.page) % page-count
  page: (page) ->
    state = page: page
    history.pushState state, \CᴜʙᴇBooks, "?#{page}"
    @setState state
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
      Book @props <<< { ref: 'book', width, height, current-page: @state.page }
      #div do
      #  className: 'navbar'
      div do
        className: "prev #{if @state.page is 0 then 'hidden' else ''}"
        "#onClick": ~> @page @state.page - 1
        span!
      div do
        className: "next #{if @state.page is page-count - 1 then 'hidden' else ''}"
        "#onClick": ~> @page @state.page + 1
        span!

module.exports = Reader
