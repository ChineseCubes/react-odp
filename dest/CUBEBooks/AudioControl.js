(function(){
  var React, div, ref$, sayIt, onClick, AudioControl;
  React = require('react');
  div = React.DOM.div;
  ref$ = require('./utils'), sayIt = ref$.sayIt, onClick = ref$.onClick;
  AudioControl = React.createClass({
    displayName: 'CUBE.Book.AudioControl',
    getDefaultProps: function(){
      return {
        id: 0,
        audio: null,
        text: '這頁沒有文字'
      };
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
    render: function(){
      var classes, ref$, this$ = this;
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
      }, ref$[onClick + ""] = function(it){
        var x$;
        switch (false) {
        case !this$.props.audio:
          if (this$.state.loading) {
            return;
          }
          if (!this$.state.playing) {
            x$ = this$.props.audio;
            x$.stop(this$.props.id);
            x$.play(this$.props.id);
          } else {
            this$.props.audio.pause();
          }
          break;
        default:
          sayIt(this$.props.text, 'zh-TW');
        }
        return this$.props[onClick + ""].call(this$, it);
      }, ref$));
    }
  });
  module.exports = AudioControl;
}).call(this);
