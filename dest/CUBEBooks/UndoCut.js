(function(){
  var React, ref$, div, i, onClick, UndoCut;
  React = require('react');
  ref$ = React.DOM, div = ref$.div, i = ref$.i;
  onClick = require('./utils').onClick;
  UndoCut = React.createClass({
    displayName: 'CUBE.UndoCut',
    getDefaultProps: function(){
      return {
        actived: false
      };
    },
    render: function(){
      var actived, ref$;
      actived = this.props.actived ? 'actived' : '';
      return div({
        className: 'comp undo-cut ui black icon buttons'
      }, div((ref$ = {
        className: "ui button " + actived
      }, ref$[onClick + ""] = this.props[onClick + ""], ref$), i({
        className: 'repeat icon'
      })));
    }
  });
  module.exports = UndoCut;
}).call(this);
