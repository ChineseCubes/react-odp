(function(){
  var React, div, Button;
  React = require('react');
  div = React.DOM.div;
  Button = React.createClass({
    displayName: 'CUBE.UI.Button',
    render: function(){
      return this.transferPropsTo(div({
        className: 'button'
      }, div({}, this.props.children)));
    }
  });
  module.exports = Button;
}).call(this);
