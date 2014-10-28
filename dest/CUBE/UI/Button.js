(function(){
  var React, div, Button;
  React = require('react');
  div = React.DOM.div;
  Button = React.createClass({
    displayName: 'CUBE.UI.Button',
    render: function(){
      var className, ref$;
      className = "button " + this.props.className;
      return div((ref$ = this.props, ref$.className = className, ref$), div({}, this.props.children));
    }
  });
  module.exports = Button;
}).call(this);
