React = require 'react'

{ nav, div, a } = React.DOM
{ onClick } = require '../utils'

Settings = React.createClass do
  displayName: 'CUBE.Book.Settings'
  getDefaultProps: ->
    mode: 'zh-TW'
    onModeClick: -> ...
  render: ->
    className = "settings #{@props.className}"
    nav do
      @props <<< { className }
      a do
        className: 'item toggle chinese'
        "#onClick": ~> @props.onModeClick.call this, it
        if @props.mode is 'zh-TW' then '繁' else '简'

module.exports = Settings
