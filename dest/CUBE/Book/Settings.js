(function(){
  var React, ref$, nav, div, a, onClick, Settings;
  React = require('react');
  ref$ = React.DOM, nav = ref$.nav, div = ref$.div, a = ref$.a;
  onClick = require('../utils').onClick;
  Settings = React.createClass({
    displayName: 'CUBE.Book.Settings',
    getDefaultProps: function(){
      return {
        mode: 'zh-TW',
        onModeClick: function(){
          throw Error('unimplemented');
        }
      };
    },
    render: function(){
      var className, ref$, this$ = this;
      className = "settings " + this.props.className;
      return nav((ref$ = this.props, ref$.className = className, ref$), a((ref$ = {
        className: 'item toggle chinese'
      }, ref$[onClick + ""] = function(it){
        return this$.props.onModeClick.call(this$, it);
      }, ref$), this.props.mode === 'zh-TW' ? '繁' : '简'));
    }
  });
  module.exports = Settings;
}).call(this);
