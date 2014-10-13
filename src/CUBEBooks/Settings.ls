React = require 'react'

{ nav, div, a } = React.DOM
{ onClick } = require './utils'

Settings = React.createClass do
  displayName: 'CCUI.Settings'
  getDefaultProps: ->
    mode: 'zh_TW'
    onModeClick: -> ...
  render: ->
    @transferPropsTo nav do
      className: 'settings'
      a do
        className: 'item toggle chinese'
        "#onClick": ~> @props.onModeClick.call this, it
        if @props.mode is 'zh_TW' then '繁' else '简'

module.exports = Settings
