React = require 'react'

{ i } = React.DOM

SettingsButton = React.createClass do
  displayName: 'CUBE.SettingsButton'
  render: ->
    @transferPropsTo i className: 'settings icon'

module.exports = SettingsButton
