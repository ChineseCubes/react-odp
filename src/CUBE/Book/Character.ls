React = require 'react'
Popup = require '../UI/Popup'

{ div, span } = React.DOM

Character = React.createClass do
  displayName: 'CUBE.Book.Character'
  getDefaultProps: ->
    data:   null
    mode:   'zh_TW'
    pinyin: off
  render: ->
    data = @props.data
    status = if @props.pinyin then '' else 'hidden'
    div do
      className: 'character'
      Popup do
        className: "pronounciation #status"
        data?pinyin
      if @props.mode is 'zh_TW'
        div do
          className: 'char zh_TW'
          data?zh_TW
      else
        div do
          className: 'char zh_CN'
          data?zh_CN

module.exports = Character
