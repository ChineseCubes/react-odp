(function(){
  var React, div, Button;
  React = require('react');
  div = React.DOM.div;
  Button = React.createClass({
    displayName: 'CCUI.Button',
    render: function(){
      return this.transferPropsTo(div({
        className: 'button'
      }, div({}, this.props.children)));
    }
  });
  module.exports = Button;
}).call(this);
