(function(){
  var $, React, API, Button, Stroker, Word, ref$, nav, div, i, span, a, onClick, Sentence, split$ = ''.split;
  $ = require('jquery');
  React = require('react');
  API = require('./api');
  Button = require('./Button');
  Stroker = require('./Stroker');
  Word = require('./Word');
  ref$ = React.DOM, nav = ref$.nav, div = ref$.div, i = ref$.i, span = ref$.span, a = ref$.a;
  onClick = require('./utils').onClick;
  Sentence = React.createClass({
    displayName: 'CUBE.Sentence',
    getDefaultProps: function(){
      return {
        data: null,
        image: '',
        stroke: true,
        sentence: true
      };
    },
    getInitialState: function(){
      return {
        mode: 'zh_TW',
        focus: null,
        undo: []
      };
    },
    componentWillReceiveProps: function(props){
      var ref$;
      if (((ref$ = this.props.data) != null ? ref$.short : void 8) !== ((ref$ = props.data) != null ? ref$.short : void 8)) {
        this.setState({
          focus: this.getInitialState().focus
        });
        $(this.refs.settings.getDOMNode()).height(0);
        return (ref$ = this.refs.stroker) != null ? ref$.setState({
          words: null
        }) : void 8;
      }
    },
    componentDidMount: function(){
      var ref$;
      if (!this.state.focus) {
        return (ref$ = this.refs[0]) != null ? ref$.click() : void 8;
      }
    },
    componentWillUpdate: function(props, state){
      var ref$;
      if (((ref$ = this.props.data) != null ? ref$.short : void 8) === ((ref$ = props.data) != null ? ref$.short : void 8)) {
        switch (false) {
        case this.state.mode === state.mode:
          return console.log('mode changed');
        case this.state.focus !== state.focus:
          return state.focus = null;
        }
      }
    },
    componentDidUpdate: function(props, state){
      var ref$;
      if (((ref$ = this.props.data) != null ? ref$.short : void 8) !== ((ref$ = props.data) != null ? ref$.short : void 8)) {
        this.setState({
          undo: []
        });
        return (ref$ = this.refs[0]) != null ? ref$.click() : void 8;
      }
    },
    toggleMode: function(){
      return this.setState({
        mode: this.state.mode === 'zh_TW' ? 'zh_CN' : 'zh_TW'
      });
    },
    toggleSettings: function(){
      var $settings;
      $settings = $(this.refs.settings.getDOMNode());
      return $settings.animate({
        height: $settings.height() !== 0 ? 0 : 48
      });
    },
    undo: function(){
      var comp, x$;
      if (comp = this.state.undo.pop()) {
        x$ = comp;
        x$.setState({
          cut: false
        });
        x$.click();
      }
    },
    undoAll: function(){
      while (this.state.undo.length) {
        this.undo();
      }
    },
    render: function(){
      var data, words, ref$, focus, this$ = this;
      data = this.props.data;
      words = (data != null ? data.childrenOfDepth(0) : void 8) || [];
      return div({
        className: 'playground',
        style: {
          backgroundImage: "url('" + this.props.image + "')"
        }
      }, div({
        className: 'comp sentence',
        style: {
          display: this.props.sentence ? 'block' : 'none'
        }
      }, this.props.stroke ? Stroker({
        key: "stroker",
        ref: "stroker"
      }) : void 8, (function(){
        var i$, results$ = [];
        for (i$ in words) {
          results$.push((fn$.call(this, i$, words[i$])));
        }
        return results$;
        function fn$(i, word){
          var id, this$ = this;
          id = (split$.call(word.short, ' ')).join('-');
          return Word({
            key: i + "-" + id,
            ref: i,
            data: word,
            mode: this.state.mode,
            onStroke: function(text, close){
              var state, stroker;
              if (!this$.refs.stroker) {
                return;
              }
              state = {
                words: text,
                play: text !== null,
                hide: text === null
              };
              stroker = this$.refs.stroker;
              if (text) {
                return API.Talks.get(text, function(err, data){
                  var x$;
                  x$ = stroker;
                  x$.onHide = function(){
                    return close();
                  };
                  x$.setState((state.strokeURI = data != null ? data.strokeURI() : void 8, state));
                  return x$;
                });
              } else {
                return stroker.setState(state);
              }
            },
            onChildCut: function(comp){
              this$.state.undo.push(comp);
              comp.setState({
                pinyin: false,
                meaning: false
              });
              return comp.click();
            },
            afterChildCut: function(comp){
              var ref$;
              return (ref$ = comp.refs[0]) != null ? ref$.click() : void 8;
            },
            onChildClick: function(comp){
              var ref$;
              if ((ref$ = this$.refs.stroker) != null) {
                ref$.setState({
                  words: null,
                  hide: true
                });
              }
              if (this$.state.focus === comp) {
                comp.setState({
                  menu: false
                });
                return this$.setState({
                  focus: null
                });
              } else {
                if ((ref$ = this$.state.focus) != null) {
                  ref$.setState({
                    menu: false,
                    pinyin: false,
                    meaning: false
                  });
                }
                comp.setState({
                  menu: true
                });
                return this$.setState({
                  focus: comp
                });
              }
            }
          });
        }
      }.call(this))), nav({
        ref: 'settings',
        className: 'navbar',
        style: {
          height: 0
        }
      }, div({
        className: 'ui borderless menu'
      }, div({
        className: 'right menu'
      }, a((ref$ = {
        className: 'item toggle chinese'
      }, ref$[onClick + ""] = this.toggleMode, ref$), this.state.mode === 'zh_TW' ? '繁' : '简')))), Button((ref$ = {
        className: "undo " + (!this.state.undo.length ? 'hidden' : '')
      }, ref$[onClick + ""] = this.undo, ref$)), div({
        className: 'entry'
      }, this.state.focus !== null ? (focus = this.state.focus.props.data, [
        span({
          className: 'ui black label'
        }, focus.flatten().map(function(it){
          return it[this$.state.mode];
        }).join('')), span({
          className: 'definition'
        }, focus.definition)
      ]) : void 8));
    }
  });
  module.exports = Sentence;
}).call(this);
