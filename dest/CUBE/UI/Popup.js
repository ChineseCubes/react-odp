(function(){
  var React, ref$, div, span, Popup;
  React = require('react');
  ref$ = React.DOM, div = ref$.div, span = ref$.span;
  Popup = React.createClass({
    displayName: 'CUBE.UI.Popup',
    render: function(){
      var className, ref$;
      className = "popup " + this.props.className;
      return div((ref$ = this.props, ref$.className = className, ref$), span({}, this.props.children));
    }
  });
  module.exports = Popup;
}).call(this);
