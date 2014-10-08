React = require 'react'

{ div, span } = React.DOM

Character = React.createClass do
  displayName: 'CUBE.Character'
  getDefaultProps: ->
    data:   null
    mode:   'zh_TW'
    pinyin: off
  render: ->
    data = @props.data
    actived = if @props.pinyin then 'actived' else ''
    div do
      className: 'comp character'
      div do
        className: "pronounciation #actived"
        span null data.pinyin
      if @props.mode is 'zh_TW'
        div do
          className: 'char zh_TW'
          data.zh_TW
      else
        div do
          className: 'char zh_CN'
          data.zh_CN

module.exports = Character
