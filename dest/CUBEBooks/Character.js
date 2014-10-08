(function(){
  var React, ref$, div, span, Character;
  React = require('react');
  ref$ = React.DOM, div = ref$.div, span = ref$.span;
  Character = React.createClass({
    displayName: 'CUBE.Character',
    getDefaultProps: function(){
      return {
        data: null,
        mode: 'zh_TW',
        pinyin: false
      };
    },
    render: function(){
      var data, actived;
      data = this.props.data;
      actived = this.props.pinyin ? 'actived' : '';
      return div({
        className: 'comp character'
      }, div({
        className: "pronounciation " + actived
      }, span(null, data.pinyin)), this.props.mode === 'zh_TW'
        ? div({
          className: 'char zh_TW'
        }, data.zh_TW)
        : div({
          className: 'char zh_CN'
        }, data.zh_CN));
    }
  });
  module.exports = Character;
}).call(this);
