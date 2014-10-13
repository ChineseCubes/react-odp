(function(){
  var React, ref$, div, span, Definition;
  React = require('react');
  ref$ = React.DOM, div = ref$.div, span = ref$.span;
  Definition = React.createClass({
    className: 'CCUI.Definition',
    getDefaultProps: function(){
      return {
        word: null,
        definition: null
      };
    },
    render: function(){
      return this.transferPropsTo(div({
        className: 'definition'
      }, this.props.word && this.props.definition ? [
        span({
          className: 'word'
        }, this.props.word), span({
          className: 'translation'
        }, this.props.definition)
      ] : void 8));
    }
  });
  module.exports = Definition;
}).call(this);
