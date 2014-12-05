(function(){
  var React, div, onClick, AudioControl;
  React = require('react');
  div = React.DOM.div;
  onClick = require('../utils').onClick;
  AudioControl = React.createClass({
    displayName: 'CUBE.Book.AudioControl',
    getDefaultProps: function(){
      var ref$;
      return ref$ = {
        loading: false,
        playing: false
      }, ref$[onClick + ""] = function(){}, ref$;
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
      var classes, ref$, this$ = this;
      classes = 'audio-control';
      if (this.props.playing) {
        classes += ' playing';
      }
      if (this.props.loading) {
        classes += ' loading';
      }
      return div((ref$ = {
        className: classes,
        style: {
          width: '100%',
          height: '100%'
        }
      }, ref$[onClick + ""] = function(){
        return this$.props[onClick + ""].apply(this$, arguments);
      }, ref$), div({}, this.props.children));
    }
  });
  module.exports = AudioControl;
}).call(this);
