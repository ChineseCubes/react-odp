(function(){
  var React, Character, Popup, Menu, API, Data, ref$, div, i, span, Howler, Howl, onClick, sayIt, punctuations, Word;
  React = require('react');
  Character = React.createFactory(require('./Character'));
  Popup = React.createFactory(require('../UI/Popup'));
  Menu = React.createFactory(require('../UI/Menu'));
  API = require('../api');
  Data = require('../data');
  ref$ = React.DOM, div = ref$.div, i = ref$.i, span = ref$.span;
  ref$ = require('howler'), Howler = ref$.Howler, Howl = ref$.Howl;
  ref$ = require('../utils'), onClick = ref$.onClick, sayIt = ref$.sayIt;
  punctuations = Object.keys(Data.punctuations).join('');
  Word = React.createClass({
    displayName: 'CUBE.Book.Word',
    getDefaultProps: function(){
      return {
        data: null,
        mode: 'zh-TW',
        menu: false,
        onStroke: function(){
          throw Error('unimplemented');
        },
        onChildCut: function(){
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
        stroke: false,
        meaning: false,
        soundURI: null
      };
    },
    componentDidUpdate: function(props, state){
      var this$ = this;
      if (state.cut === false && this.state.cut === true) {
        this.props.onChildCut(this);
      }
      if (this.state.pinyin) {
        sayIt(this.props.data.toString(this.props.mode), this.props.mode);
      }
      if (state.stroke !== this.state.stroke) {
        this.props.onStroke(this.state.stroke ? this.props.data.toString(this.props.mode) : null, function(){
          return this$.setState({
            pinyin: false,
            stroke: false,
            meaning: false
          });
        });
      }
      if (this.state.meaning) {
        sayIt(this.props.data.short);
      }
    },
    click: function(){
      return this.props.onChildClick(this);
    },
    render: function(){
      var data, meaningStatus, ref$, menuStatus, withHint, pinyin, stroke, english, this$ = this;
      data = this.props.data;
      meaningStatus = !this.state.meaning ? 'hidden' : '';
      return div((ref$ = {
        className: 'word'
      }, ref$[onClick + ""] = function(){
        if (!this$.state.cut) {
          return this$.click();
        }
      }, ref$), this.state.menu ? (menuStatus = data.children.length === 1 ? 'hidden' : '', Menu({
        className: 'menu-cut',
        buttons: ["cut " + menuStatus],
        onButtonClick: function(classes){
          var ref$, name, status;
          ref$ = classes.split(' '), name = ref$[0], status = ref$[1];
          if (name !== 'cut') {
            return;
          }
          if (status !== 'hidden') {
            this$.props.onChildClick(this$);
            this$.setState({
              cut: true
            });
          }
        }
      })) : void 8, this.state.menu ? (withHint = this.state.pinyin || this.state.meaning ? 'with-hint' : '', pinyin = this.state.pinyin ? 'pinyin actived' : 'pinyin', data.isLeaf() && data.children[0].pinyin.length === 0 && (pinyin += ' hidden'), stroke = this.state.stroke ? 'stroke actived' : 'stroke', !data.isLeaf() && (stroke += ' hidden'), in$(data.toString(this.props.mode), punctuations) && (stroke += ' hidden'), english = this.state.meaning ? 'english actived' : 'english', data.short.length === 0 && (english += ' hidden'), Menu({
        className: "menu-learn " + withHint,
        buttons: [pinyin, stroke, english],
        onButtonClick: function(classes){
          var ref$, name, status;
          ref$ = classes.split(' '), name = ref$[0], status = ref$[1];
          if (name === 'pinyin') {
            return this$.setState({
              pinyin: !this$.state.pinyin,
              stroke: false,
              meaning: false
            });
          } else if (name === 'stroke') {
            return this$.setState({
              pinyin: false,
              stroke: !this$.state.stroke,
              meaning: false
            });
          } else if (name === 'english') {
            return this$.setState({
              pinyin: false,
              stroke: false,
              meaning: !this$.state.meaning
            });
          }
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
              onChildClick: function(it){
                return this$.props.onChildClick(it);
              }
            });
          }
        }.call(this))), Popup({
        className: "down meaning " + meaningStatus
      }, data.short));
    }
  });
  module.exports = Word;
  function in$(x, xs){
    var i = -1, l = xs.length >>> 0;
    while (++i < l) if (x === xs[i]) return true;
    return false;
  }
}).call(this);
