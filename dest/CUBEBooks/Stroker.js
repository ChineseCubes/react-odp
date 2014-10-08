(function(){
  var $, React, zhStrokeData, Data, div, onClick, Stroker;
  $ = require('jquery');
  React = require('react');
  zhStrokeData = (function(){
    try {
      return require('zhStrokeData');
    } catch (e$) {}
  }());
  Data = require('./data');
  div = React.DOM.div;
  onClick = require('./utils').onClick;
  Stroker = React.createClass({
    displayName: 'ZhStrokeData.SpriteStroker',
    getDefaultProps: function(){
      return {
        path: './strokes/'
      };
    },
    getInitialState: function(){
      return {
        play: false,
        hide: true,
        words: null,
        stroker: null,
        strokeURI: null
      };
    },
    componentWillUpdate: function(props, state){
      var punc;
      if (!state.words || this.props.fallback) {
        return;
      }
      punc = new RegExp(Object.keys(Data.punctuations).join('|'), 'g');
      state.words = state.words.replace(punc, '');
      if (this.state.hide !== state.hide && state.hide === true) {
        return this.onHide.call(this);
      }
    },
    componentDidUpdate: function(oldProps, oldState){
      var $container, x$;
      $container = $(this.refs.container.getDOMNode());
      $container.empty();
      if (!this.state.words || this.state.words.length === 0 || this.state.strokeURI) {
        return;
      }
      if (!this.state.stroker || oldState.words !== this.state.words) {
        this.state.stroker = new zhStrokeData.SpriteStroker(this.state.words, {
          url: this.props.path,
          speed: 5000,
          width: 215,
          height: 215
        });
      }
      $container.append(this.state.stroker.domElement);
      if (this.state.play) {
        this.state.play = false;
        x$ = this.state.stroker;
        x$.play();
        return x$;
      }
    },
    onHide: function(){
      throw Error('unimplemented');
    },
    render: function(){
      var ref$, this$ = this;
      return div((ref$ = {
        className: 'strokes',
        style: {
          display: !this.state.hide ? 'block' : 'none'
        }
      }, ref$[onClick + ""] = function(){
        return this$.setState({
          hide: true
        });
      }, ref$), !this.state.strokeURI
        ? div({
          className: 'grid'
        })
        : div({
          className: 'fallback',
          style: {
            backgroundImage: "url(" + this.state.strokeURI + "?" + Date.now() + ")"
          }
        }), div({
        ref: 'container'
      }));
    }
  });
  module.exports = Stroker;
}).call(this);
