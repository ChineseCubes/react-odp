(function(){
  var React, Character, Menu, API, ref$, div, i, span, Howler, Howl, onClick, sayIt, Word;
  React = require('react');
  Character = require('./Character');
  Menu = require('./Menu');
  API = require('./api');
  ref$ = React.DOM, div = ref$.div, i = ref$.i, span = ref$.span;
  ref$ = require('howler'), Howler = ref$.Howler, Howl = ref$.Howl;
  ref$ = require('./utils'), onClick = ref$.onClick, sayIt = ref$.sayIt;
  Word = React.createClass({
    displayName: 'CUBE.Word',
    getDefaultProps: function(){
      return {
        data: null,
        mode: 'zh_TW',
        menu: false,
        onStroke: function(){
          throw Error('unimplemented');
        },
        onChildCut: function(){
          throw Error('unimplemented');
        },
        afterChildCut: function(){
          throw Error('unimplemented');
        },
        onChildClick: function(){
          throw Error('unimplemented');
        }
      };
    },
    getInitialState: function(){
      return {
        menu: this.props.menu,
        cut: false,
        pinyin: false,
        meaning: false,
        soundURI: null
      };
    },
    componentDidUpdate: function(props, state){
      if (state.cut === false && this.state.cut === true) {
        this.props.afterChildCut(this);
      }
    },
    click: function(){
      return this.props.onChildClick(this);
    },
    render: function(){
      var data, lang, actived, ref$, status, withHint, this$ = this;
      data = this.props.data;
      lang = function(it){
        switch (it) {
        case 'zh_TW':
          return 'zh-TW';
        case 'zh_CN':
          return 'zh-CN';
        }
      };
      actived = this.state.meaning ? 'actived' : '';
      return div((ref$ = {
        className: 'comp word'
      }, ref$[onClick + ""] = function(){
        if (!this$.state.cut) {
          return this$.click();
        }
      }, ref$), this.state.menu ? (status = data.children.length === 1 ? 'hidden' : '', Menu({
        className: 'menu-cut',
        buttons: ["cut " + status],
        onButtonClick: function(classes){
          var ref$, name, status, x$;
          ref$ = classes.split(' '), name = ref$[0], status = ref$[1];
          if (name !== 'cut') {
            return;
          }
          if (status !== 'hidden') {
            x$ = this$.props;
            x$.onChildCut(this$);
            x$.onChildClick(this$);
            this$.setState({
              cut: true
            });
          }
        }
      })) : void 8, this.state.menu ? (withHint = this.state.pinyin || this.state.meaning ? 'with-hint' : '', Menu({
        className: "menu-learn " + withHint,
        buttons: ['pinyin', 'stroke', 'english'],
        onButtonClick: function(classes){
          return console.log(classes);
        }
      })) : void 8, div({
        className: 'characters'
      }, !this.state.cut
        ? (function(){
          var i$, results$ = [];
          for (i$ in data.flatten()) {
            results$.push((fn$.call(this, i$, data.flatten()[i$])));
          }
          return results$;
          function fn$(i, c){
            return Character({
              key: i,
              data: c,
              mode: this.props.mode,
              pinyin: this.state.pinyin
            });
          }
        }.call(this))
        : (function(){
          var i$, results$ = [];
          for (i$ in data.children) {
            results$.push((fn$.call(this, i$, data.children[i$])));
          }
          return results$;
          function fn$(i, c){
            var this$ = this;
            return Word({
              key: i + "-" + c.short,
              ref: i,
              data: c,
              mode: this.props.mode,
              onStroke: function(it, close){
                return this$.props.onStroke(it, close);
              },
              onChildCut: function(it){
                return this$.props.onChildCut(it);
              },
              afterChildCut: function(it){
                return this$.props.afterChildCut(it);
              },
              onChildClick: function(it){
                return this$.props.onChildClick(it);
              }
            });
          }
        }.call(this))), div({
        className: "meaning " + actived
      }, span(null, data.short)));
    }
  });
  module.exports = Word;
}).call(this);
