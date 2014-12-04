(function(){
  var React, scaleLength, ref$, svg, path, CustomShape;
  React = require('react');
  scaleLength = require('../ODP').scaleLength;
  ref$ = React.DOM, svg = ref$.svg, path = ref$.path;
  CustomShape = module.exports = React.createClass({
    getDefaultProps: function(){
      return {
        data: null
      };
    },
    render: function(){
      var scale, ref$, width, height, x, y, viewbox, enhancedPath;
      scale = this.props.scale;
      ref$ = this.props.data.attrs, width = ref$.width, height = ref$.height, x = ref$.x, y = ref$.y;
      ref$ = this.props.data.children[1].attrs.style, viewbox = ref$.viewbox, enhancedPath = ref$.enhancedPath;
      width = scaleLength(scale, width);
      height = scaleLength(scale, height);
      x = scaleLength(scale, x);
      y = scaleLength(scale, y);
      return svg({
        className: 'enhanced-geometry',
        viewBox: viewbox,
        width: width,
        height: height,
        preserveAspectRatio: 'none meet',
        style: {
          left: x,
          top: y
        }
      }, path({
        fill: '#fff',
        d: enhancedPath
      }));
    }
  });
}).call(this);
