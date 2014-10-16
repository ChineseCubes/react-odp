(function(){
  var React, Popup, ref$, div, span, Character;
  React = require('react');
  Popup = require('./Popup');
  ref$ = React.DOM, div = ref$.div, span = ref$.span;
  Character = React.createClass({
    displayName: 'CUBE.Book.Character',
    getDefaultProps: function(){
      return {
        data: null,
        mode: 'zh_TW',
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
        className: "pronounciation " + status
      }, data != null ? data.pinyin : void 8), this.props.mode === 'zh_TW'
        ? div({
          className: 'char zh_TW'
        }, data != null ? data.zh_TW : void 8)
        : div({
          className: 'char zh_CN'
        }, data != null ? data.zh_CN : void 8));
    }
  });
  module.exports = Character;
}).call(this);
