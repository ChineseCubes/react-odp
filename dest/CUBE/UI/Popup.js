(function(){
  var React, ref$, div, span, Popup;
  React = require('react');
  ref$ = React.DOM, div = ref$.div, span = ref$.span;
  Popup = React.createClass({
    displayName: 'CUBE.UI.Popup',
    render: function(){
      return this.transferPropsTo(div({
        className: 'popup'
      }, span({}, this.props.children)));
    }
  });
  module.exports = Popup;
}).call(this);
