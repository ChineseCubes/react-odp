(function(){
  var React, ref$, isArray, isString, isNumber, filter, map, mapValues, cloneDeep, camelFromHyphenated, scaleLength, removeLineHeight, makeInteractive, scaleEverything, setImageHref, mixin, components, lookup, render, register;
  React = require('react');
  ref$ = require('lodash'), isArray = ref$.isArray, isString = ref$.isString, isNumber = ref$.isNumber, filter = ref$.filter, map = ref$.map, mapValues = ref$.mapValues, cloneDeep = ref$.cloneDeep;
  camelFromHyphenated = require('../CUBE/utils').camelFromHyphenated;
  scaleLength = curry$(function(scale, value, key){
    var r;
    key == null && (key = '');
    switch (false) {
    case !in$(key, ['opacity']):
      return value;
    case !isNumber(value):
      return value * scale;
    case !/^-?\d*\.?\d+%$/.test(value):
      return value;
    case !(r = /^(-?\d*\.?\d+)(in|cm|mm|px|pc|pt)?$/.exec(value)):
      return +r[1] * scale + "" + (r[2] || '');
    default:
      return value;
    }
  });
  removeLineHeight = function(it){
    var props, ref$;
    props = it.props;
    if (props != null) {
      if ((ref$ = props.style) != null) {
        delete ref$.lineHeight;
      }
    }
    return it;
  };
  makeInteractive = function(it){
    var props, ref$;
    props = it.props;
    if (props != null && props.onClick) {
      if ((ref$ = props.style) != null) {
        ref$.cursor = 'pointer';
      }
    }
    return it;
  };
  scaleEverything = function(it){
    var props;
    props = it.props;
    props.style = mapValues(import$({}, props.style), scaleLength(props.scale));
    return it;
  };
  setImageHref = function(it){
    var props;
    props = it.props;
    if (props.href) {
      props.style.backgroundImage = "url(" + props.href + ")";
    }
    delete props.href;
    return it;
  };
  mixin = {
    getDefaultProps: function(){
      return {
        scale: 1.0,
        namepath: []
      };
    },
    doRender: function(){
      return React.DOM[this.props.htmlTag || 'div'](this.props);
    }
  };
  components = {
    undefined: {},
    office: {
      presentation: React.createFactory(React.createClass({
        displayName: 'ReactODP.Presentation',
        mixins: [mixin],
        render: function(){
          scaleEverything(
          this);
          return this.doRender();
        }
      }))
    },
    draw: {
      page: React.createFactory(React.createClass({
        displayName: 'ReactODP.Page',
        mixins: [mixin],
        render: function(){
          scaleEverything(
          this);
          return this.doRender();
        }
      })),
      frame: React.createFactory(React.createClass({
        displayName: 'ReactODP.Frame',
        mixins: [mixin],
        render: function(){
          removeLineHeight(
          scaleEverything(
          this));
          return this.doRender();
        }
      })),
      textBox: React.createFactory(React.createClass({
        displayName: 'ReactODP.TextBox',
        mixins: [mixin],
        render: function(){
          scaleEverything(
          this);
          return this.doRender();
        }
      })),
      image: React.createFactory(React.createClass({
        displayName: 'ReactODP.Image',
        mixins: [mixin],
        render: function(){
          makeInteractive(
          setImageHref(
          scaleEverything(
          this)));
          return this.doRender();
        }
      }))
    },
    text: {
      verticalAligner: React.createFactory(React.createClass({
        displayName: 'ReactODP.VerticalAligner',
        mixins: [mixin],
        getDefaultProps: function(){
          return {
            htmlTag: 'span'
          };
        },
        render: function(){
          scaleEverything(
          this);
          return this.doRender();
        }
      })),
      p: React.createFactory(React.createClass({
        displayName: 'ReactODP.P',
        mixins: [mixin],
        render: function(){
          removeLineHeight(
          scaleEverything(
          this));
          return this.doRender();
        }
      })),
      span: React.createFactory(React.createClass({
        displayName: 'ReactODP.Span',
        mixins: [mixin],
        render: function(){
          makeInteractive(
          scaleEverything(
          this));
          return this.doRender();
        }
      })),
      lineBreak: React.createFactory(React.createClass({
        displayName: 'ReactODP.LineBreak',
        mixins: [mixin],
        getDefaultProps: function(){
          return {
            htmlTag: 'br'
          };
        },
        render: function(){
          scaleEverything(
          this);
          return this.doRender();
        }
      }))
    }
  };
  lookup = function(node){
    var ref$;
    return (ref$ = components[node.namespace]) != null ? ref$[camelFromHyphenated(node.name)] : void 8;
  };
  render = function(node, scale, getComponent, namepath){
    var props, x$, children, res$, i, ref$, c, comp;
    scale == null && (scale = 1.0);
    getComponent == null && (getComponent = lookup);
    namepath == null && (namepath = []);
    switch (false) {
    case !!node:
      return null;
    default:
      props = cloneDeep(node.attrs);
      x$ = props;
      x$.className = node.namespace + " " + node.name + " " + (props.className || '');
      x$.scale = scale;
      x$.namepath = namepath.concat([node.name]);
      res$ = [];
      for (i in ref$ = node.children) {
        c = ref$[i];
        c.attrs.ref = i;
        res$.push(render(c, scale, getComponent, namepath));
      }
      children = res$;
      if (node.text) {
        children.push(node.text);
      }
      comp = getComponent(node);
      return typeof comp == 'function' ? comp(props, children) : void 8;
    }
  };
  register = function(namespace, name, comp){
    var ref$;
    return comp != null ? (ref$ = components[namespace]) != null ? ref$[name] = comp : void 8 : void 8;
  };
  module.exports = {
    scaleLength: scaleLength,
    mixin: mixin,
    render: render,
    register: register
  };
  function in$(x, xs){
    var i = -1, l = xs.length >>> 0;
    while (++i < l) if (x === xs[i]) return true;
    return false;
  }
  function curry$(f, bound){
    var context,
    _curry = function(args) {
      return f.length > 1 ? function(){
        var params = args ? args.concat() : [];
        context = bound ? context || this : this;
        return params.push.apply(params, arguments) <
            f.length && arguments.length ?
          _curry.call(context, params) : f.apply(context, params);
      } : f;
    };
    return _curry();
  }
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
