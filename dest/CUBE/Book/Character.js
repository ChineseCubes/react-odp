(function(){
  var React, Popup, ref$, div, span, Character;
  React = require('react');
  Popup = require('../UI/Popup');
  ref$ = React.DOM, div = ref$.div, span = ref$.span;
  Character = React.createClass({
    displayName: 'CUBE.Book.Character',
    getDefaultProps: function(){
      return {
        data: null,
        mode: 'zh-TW',
        pinyin: false
      };
    },
    render: function(){
      var data, status;
      data = this.props.data;
      status = this.props.pinyin ? '' : 'hidden';
      return div({
        className: 'character'
      }, Popup({
        className: "up pronounciation " + status
      }, data != null ? data.pinyin : void 8), this.props.mode === 'zh-TW'
        ? div({
          className: 'char zh-TW'
        }, data != null ? data['zh-TW'] : void 8)
        : div({
          className: 'char zh-CN'
        }, data != null ? data['zh-CN'] : void 8));
    }
  });
  module.exports = Character;
}).call(this);
