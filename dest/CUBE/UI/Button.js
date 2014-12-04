(function(){
  var React, NotifyMixin, div, Button;
  React = require('react');
  NotifyMixin = require('../NotifyMixin');
  div = React.DOM.div;
  Button = React.createClass({
    displayName: 'CUBE.UI.Button',
    mixins: [NotifyMixin],
    render: function(){
      var className, style, click, ref$, this$ = this;
      className = "button " + this.props.className;
      style = this.props.style;
      click = this.props.onClick;
      return div((ref$ = this.props, ref$.className = className, ref$.style = style, ref$.onClick = function(){
        return click.apply(this$, arguments);
      }, ref$), div({}, this.props.children));
    }
  });
  module.exports = Button;
}).call(this);
