(function(){
  var React, ref$, nav, div, a, onClick, Settings;
  React = require('react');
  ref$ = React.DOM, nav = ref$.nav, div = ref$.div, a = ref$.a;
  onClick = require('./utils').onClick;
  Settings = React.createClass({
    displayName: 'CCUI.Settings',
    getDefaultProps: function(){
      return {
        mode: 'zh_TW',
        onModeClick: function(){
          throw Error('unimplemented');
        }
      };
    },
    render: function(){
      var ref$, this$ = this;
      return this.transferPropsTo(nav({
        className: 'settings'
      }, a((ref$ = {
        className: 'item toggle chinese'
      }, ref$[onClick + ""] = function(it){
        return this$.props.onModeClick.call(this$, it);
      }, ref$), this.props.mode === 'zh_TW' ? '繁' : '简')));
    }
  });
  module.exports = Settings;
}).call(this);
