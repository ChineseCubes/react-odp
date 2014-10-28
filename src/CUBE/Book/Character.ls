React = require 'react'
Popup = React.createFactory require '../UI/Popup'

{ div, span } = React.DOM

Character = React.createClass do
  displayName: 'CUBE.Book.Character'
  getDefaultProps: ->
    data:   null
    mode:   'zh-TW'
    pinyin: off
  render: ->
    data = @props.data
    status = if @props.pinyin then '' else 'hidden'
    div do
      className: 'character'
      Popup do
        className: "up pronounciation #status"
        data?pinyin
      if @props.mode is 'zh-TW'
        div do
          className: 'char zh-TW'
          data?['zh-TW']
      else
        div do
          className: 'char zh-CN'
          data?['zh-CN']

module.exports = Character
