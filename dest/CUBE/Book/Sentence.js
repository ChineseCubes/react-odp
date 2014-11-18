(function(){
  var React, API, Word, Stroker, ref$, nav, div, i, span, a, onClick, Sentence, split$ = ''.split;
  React = require('react');
  API = require('../api');
  Word = React.createFactory(require('./Word'));
  Stroker = React.createFactory(require('./Stroker'));
  ref$ = React.DOM, nav = ref$.nav, div = ref$.div, i = ref$.i, span = ref$.span, a = ref$.a;
  onClick = require('../utils').onClick;
  Sentence = React.createClass({
    displayName: 'CUBE.Book.Sentence',
    getDefaultProps: function(){
      return {
        data: null,
        mode: 'zh-TW',
        onWordCut: function(){
          throw Error('unimplemented');
        },
        onWordClick: function(){
          throw Error('unimplemented');
        }
      };
    },
    componentWillReceiveProps: function(props){
      var ref$;
      if (((ref$ = this.props.data) != null ? ref$.short : void 8) !== ((ref$ = props.data) != null ? ref$.short : void 8)) {
        return (ref$ = this.refs.stroker) != null ? ref$.setState({
          words: null
        }) : void 8;
      }
    },
    render: function(){
      var data, words, className, ref$;
      data = this.props.data;
      words = (data != null ? data.childrenOfDepth(0) : void 8) || [];
      className = "sentence " + this.props.className;
      return div((ref$ = this.props, ref$.className = className, ref$), Stroker({
        key: "stroker",
        ref: "stroker",
        mode: this.props.mode
      }), (function(){
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
            mode: this.props.mode,
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
              return stroker.setState(state);
            },
            onChildCut: function(comp){
              return this$.props.onWordCut.call(this$, comp);
            },
            onChildClick: function(comp){
              var ref$;
              if ((ref$ = this$.refs.stroker) != null) {
                ref$.setState({
                  words: null,
                  hide: true
                });
              }
              return this$.props.onWordClick.call(this$, comp);
            }
          });
        }
      }.call(this)));
    }
  });
  module.exports = Sentence;
}).call(this);
