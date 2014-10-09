(function(){
  var React, Button, div, onClick, Menu;
  React = require('react');
  Button = require('./Button');
  div = React.DOM.div;
  onClick = require('./utils').onClick;
  Menu = React.createClass({
    displayName: 'CCUI.Menu',
    getDefaultProps: function(){
      return {
        buttons: [],
        onButtonClick: function(){
          throw Error('unimplemented');
        }
      };
    },
    render: function(){
      return this.transferPropsTo(div({
        className: 'menu'
      }, div({
        className: 'buttons'
      }, (function(){
        var i$, results$ = [];
        for (i$ in this.props.buttons) {
          results$.push((fn$.call(this, i$, this.props.buttons[i$])));
        }
        return results$;
        function fn$(idx, btn){
          var ref$, this$ = this;
          return Button((ref$ = {
            key: idx,
            className: btn
          }, ref$[onClick + ""] = function(it){
            it.stopPropagation();
            return this$.props.onButtonClick.call(this$, btn);
          }, ref$));
        }
      }.call(this)))));
    }
  });
  module.exports = Menu;
}).call(this);
