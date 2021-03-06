(function(){
  var React, ref$, dl, dt, dd, Definition;
  React = require('react');
  ref$ = React.DOM, dl = ref$.dl, dt = ref$.dt, dd = ref$.dd;
  Definition = React.createClass({
    className: 'CUBE.Book.Definition',
    getDefaultProps: function(){
      return {
        word: null,
        definition: null
      };
    },
    render: function(){
      var className, ref$;
      className = "definition " + this.props.className;
      return dl((ref$ = this.props, ref$.className = className, ref$), this.props.word && this.props.definition ? [dt({}, this.props.word), dd({}, this.props.definition)] : void 8);
    }
  });
  module.exports = Definition;
}).call(this);
