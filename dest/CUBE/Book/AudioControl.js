(function(){
  var React, div, ref$, sayIt, onClick, AudioControl;
  React = require('react');
  div = React.DOM.div;
  ref$ = require('../utils'), sayIt = ref$.sayIt, onClick = ref$.onClick;
  AudioControl = React.createClass({
    displayName: 'CUBE.Book.AudioControl',
    getDefaultProps: function(){
      var ref$;
      return ref$ = {
        id: 0,
        audio: null,
        text: '這頁沒有文字',
        onMount: function(){
          throw Error('unimplemented');
        }
      }, ref$[onClick + ""] = function(){
        throw Error('unimplemented');
      }, ref$;
    },
    getInitialState: function(){
      return {
        loading: true,
        playing: false
      };
    },
    componentWillMount: function(){
      var x$;
      if (!this.props.audio) {
        this.state.loading = false;
        return;
      }
      x$ = this.props.audio;
      x$.on('load', this.onLoad);
      x$.on('play', this.onPlay);
      x$.on('pause', this.onStop);
      x$.on('end', this.onStop);
      return x$;
    },
    componentDidMount: function(){
      return this.props.onMount.apply(this, arguments);
    },
    componentWillUnmount: function(){
      var x$;
      if (!this.props.audio) {
        return;
      }
      x$ = this.props.audio;
      x$.off('load', this.onLoad);
      x$.off('play', this.onPlay);
      x$.off('pause', this.onStop);
      x$.off('end', this.onStop);
      return x$;
    },
    onLoad: function(){
      return this.setState({
        loading: false
      });
    },
    onPlay: function(){
      return this.setState({
        playing: true
      });
    },
    onStop: function(){
      return this.setState({
        playing: false
      });
    },
    play: function(){
      var x$;
      if (this.props.audio) {
        if (this.state.loading) {
          return;
        }
        if (!this.state.playing) {
          x$ = this.props.audio;
          x$.stop(this.props.id);
          x$.play(this.props.id);
        } else {
          this.props.audio.pause();
        }
      } else {
        sayIt(this.props.text, 'zh-TW');
      }
      return this.props[onClick + ""].apply(this, arguments);
    },
    render: function(){
      var classes, ref$;
      classes = 'audio-control';
      if (this.state.playing) {
        classes += ' playing';
      }
      if (this.state.loading) {
        classes += ' loading';
      }
      return div((ref$ = {
        className: classes,
        style: {
          width: '100%',
          height: '100%'
        }
      }, ref$[onClick + ""] = this.play, ref$));
    }
  });
  module.exports = AudioControl;
}).call(this);
