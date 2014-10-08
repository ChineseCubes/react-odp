(function(){
  var React, i, SettingsButton;
  React = require('react');
  i = React.DOM.i;
  SettingsButton = React.createClass({
    displayName: 'CUBE.SettingsButton',
    render: function(){
      return this.transferPropsTo(i({
        className: 'settings icon'
      }));
    }
  });
  module.exports = SettingsButton;
}).call(this);
