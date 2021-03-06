(function(){
  var React, div, DotsDetector;
  React = require('react');
  div = React.DOM.div;
  DotsDetector = React.createClass({
    displayName: 'DotsDetector',
    pxFromStyle: function(it){
      var result, px;
      result = /(\d*\.?\d+)px/.exec(it);
      if (result) {
        px = result[1];
      }
      return +px;
    },
    getDefaultProps: function(){
      return {
        unit: 'in',
        scale: 1024
      };
    },
    getInitialState: function(){
      return {
        x: 96,
        y: 96
      };
    },
    componentDidMount: function(){
      var style, x$;
      style = getComputedStyle(this.refs.unit.getDOMNode());
      x$ = this.state;
      x$.x = this.pxFromStyle(style.width) / this.props.scale;
      x$.y = this.pxFromStyle(style.height) / this.props.scale;
    },
    render: function(){
      return div({
        ref: 'unit',
        style: {
          position: 'absolute',
          display: 'none',
          width: this.props.scale + "" + this.props.unit,
          height: this.props.scale + "" + this.props.unit
        }
      });
    }
  });
  module.exports = DotsDetector;
}).call(this);
