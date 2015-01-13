(function(){
  var $, React, Button, Sentence, Settings, Definition, ref$, nav, div, i, span, a, onClick, Playground;
  $ = require('jquery');
  React = require('react');
  Button = React.createFactory(require('../UI/Button'));
  Sentence = React.createFactory(require('./Sentence'));
  Settings = React.createFactory(require('./Settings'));
  Definition = React.createFactory(require('./Definition'));
  ref$ = React.DOM, nav = ref$.nav, div = ref$.div, i = ref$.i, span = ref$.span, a = ref$.a;
  onClick = require('../utils').onClick;
  Playground = React.createClass({
    displayName: 'CUBE.Book.Playground',
    getDefaultProps: function(){
      return {
        data: null,
        image: '',
        sentence: true
      };
    },
    getInitialState: function(){
      return {
        mode: 'zh-TW',
        focus: null,
        undo: []
      };
    },
    componentWillReceiveProps: function(props){
      var ref$, ref1$;
      if (((ref$ = this.props.data) != null ? ref$.short : void 8) !== ((ref1$ = props.data) != null ? ref1$.short : void 8)) {
        this.undoAll();
        this.setState({
          focus: this.getInitialState().focus
        });
        return $(this.refs.settings.getDOMNode()).height(0);
      }
    },
    componentWillUpdate: function(props, state){
      var ref$, ref1$;
      if (((ref$ = this.props.data) != null ? ref$.short : void 8) === ((ref1$ = props.data) != null ? ref1$.short : void 8)) {
        if (this.state.mode !== state.mode) {
          return console.log('mode will change');
        }
      }
    },
    componentDidUpdate: function(props, state){
      var ref$, ref1$, ref2$;
      if (((ref$ = this.props.data) != null ? ref$.short : void 8) !== ((ref1$ = props.data) != null ? ref1$.short : void 8)) {
        if ((ref2$ = this.refs.sentence.refs[0]) != null) {
          ref2$.click();
        }
      }
      if (this.state.focus) {
        return this.state.focus.setState({
          menu: true
        });
      }
    },
    toggleMode: function(){
      return this.setState({
        mode: this.state.mode === 'zh-TW' ? 'zh-CN' : 'zh-TW'
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
      var i$, ref$, len$, comp;
      for (i$ = 0, len$ = (ref$ = this.state.undo).length; i$ < len$; ++i$) {
        comp = ref$[i$];
        comp.setState({
          cut: false
        });
      }
      this.setState({
        undo: []
      });
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
      }, Sentence({
        ref: 'sentence',
        className: this.props.sentence ? '' : 'hidden',
        data: data,
        mode: this.state.mode,
        focus: this.state.focus,
        onWordCut: function(it){
          this$.state.undo.push(it);
          return it.refs[0].click();
        },
        onWordClick: function(it){
          var ref$;
          if ((ref$ = this$.state.focus) != null) {
            ref$.setState({
              menu: false,
              pinyin: false,
              stroke: false,
              meaning: false
            });
          }
          return this$.setState({
            focus: this$.state.focus === it ? null : it
          });
        }
      }), Settings({
        ref: 'settings',
        style: {
          height: 0
        },
        mode: this.state.mode,
        onModeClick: this.toggleMode
      }), Button((ref$ = {
        className: "undo " + (!this.state.undo.length ? 'hidden' : '')
      }, ref$[onClick + ""] = this.undo, ref$)), Definition(this.state.focus !== null
        ? (focus = this.state.focus.props.data, {
          word: focus.flatten().map(function(it){
            return it[this$.state.mode];
          }).join(''),
          definition: focus.definition
        })
        : {
          word: '',
          definition: ''
        }));
    }
  });
  module.exports = Playground;
}).call(this);
