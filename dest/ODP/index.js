(function(){
  var React, camelFromHyphenated, ref$, isArray, isString, isNumber, filter, map, mapValues, cloneDeep, scaleLength, renderProps, doTextareaVerticalAlign, fromVerticalAlign, doVerticalAlign, removeLineHeight, makeInteractive, DrawMixin, defaultComponents, lookup, render;
  React = require('react');
  camelFromHyphenated = require('../CUBE/utils').camelFromHyphenated;
  ref$ = require('lodash'), isArray = ref$.isArray, isString = ref$.isString, isNumber = ref$.isNumber, filter = ref$.filter, map = ref$.map, mapValues = ref$.mapValues, cloneDeep = ref$.cloneDeep;
  scaleLength = function(scale, value, key){
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
  };
  renderProps = function(it){
    var ref$, key$;
    return (ref$ = defaultComponents[camelFromHyphenated(it.data.namespace)]) != null ? typeof ref$[key$ = camelFromHyphenated(it.data.name)] === 'function' ? ref$[key$](it) : void 8 : void 8;
  };
  doTextareaVerticalAlign = function(it){
    var ref$, ref1$, style, i$;
    if (!(it != null && ((ref$ = it.attrs) != null && ((ref1$ = ref$.style) != null && ref1$.textareaVerticalAlign)))) {
      return;
    }
    style = it.attrs.style;
    for (i$ in it.children) {
      (fn$.call(this, i$, it.children[i$]));
    }
    return it;
    function fn$(i, child){
      var ref$, ref1$;
      import$((ref1$ = (ref$ = child.attrs).style) != null
        ? ref1$
        : ref$.style = {}, it.name === 'frame' ? {
        textareaVerticalAlign: style.textareaVerticalAlign
      } : void 8);
    }
  };
  fromVerticalAlign = function(it){
    switch (it) {
    case 'top':
      return 'flex-start';
    case 'middle':
      return 'center';
    case 'bottom':
      return 'flex-end';
    default:
      return 'flex-start';
    }
  };
  doVerticalAlign = function(it){
    var attrs, ref$;
    if ((it != null ? it.name : void 8) === 'frame') {
      return;
    }
    attrs = it != null ? it.attrs : void 8;
    if (!(attrs != null && ((ref$ = attrs.style) != null && ref$.textareaVerticalAlign))) {
      return;
    }
    attrs.className = "aligned " + attrs.style.textareaVerticalAlign;
    /**
    it.children.unshift do
      name: 'vertical-aligner'
      namespace: 'helper'
      attrs:
        style:
          display: \inline-block
          height:  \100%
          vertical-align: style.textarea-vertical-align
      children: []
    /**/
    return it;
  };
  removeLineHeight = function(it){
    var ref$, ref1$;
    if (it != null) {
      if ((ref$ = it.attrs) != null) {
        if ((ref1$ = ref$.style) != null) {
          delete ref1$.lineHeight;
        }
      }
    }
    return it;
  };
  makeInteractive = function(it){
    var ref$;
    if (it != null && ((ref$ = it.attrs) != null && ref$.onClick)) {
      if ((ref$ = it.attrs.style) != null) {
        ref$.cursor = 'pointer';
      }
    }
    return it;
  };
  DrawMixin = {
    scaleStyle: function(value, key){
      return scaleLength(this.props.scale, value, key);
    },
    getDefaultProps: function(){
      return {
        scale: 1.0,
        parents: [],
        renderProps: renderProps
      };
    },
    applyMiddlewares: function(it){
      var i$, ref$, len$, f, results$ = [];
      if (isArray(this.middlewares)) {
        for (i$ = 0, len$ = (ref$ = this.middlewares).length; i$ < len$; ++i$) {
          f = ref$[i$];
          results$.push(f(it));
        }
        return results$;
      }
    },
    render: function(){
      var ref$;
      if (((ref$ = this.props.style) != null ? ref$.display : void 8) === 'none' && attrs.href) {
        return React.DOM.div({});
      }
      this.props.style = mapValues(importAll$({}, this.props.style), this.scaleStyle);
      if (this.props.href) {
        this.props.style.backgroundImage = "url(" + this.props.href + ")";
      }
      return React.DOM[this.props.htmlTag || 'div'](this.props);
    }
  };
  defaultComponents = {
    office: {
      presentation: React.createFactory(React.createClass({
        displayName: 'ReactODP.Presentation',
        mixins: [DrawMixin]
      }))
    },
    draw: {
      page: React.createFactory(React.createClass({
        displayName: 'ReactODP.Page',
        mixins: [DrawMixin],
        middlewares: [doTextareaVerticalAlign, doVerticalAlign]
      })),
      frame: React.createFactory(React.createClass({
        displayName: 'ReactODP.Frame',
        mixins: [DrawMixin],
        middlewares: [doTextareaVerticalAlign, removeLineHeight]
      })),
      textBox: React.createFactory(React.createClass({
        displayName: 'ReactODP.TextBox',
        mixins: [DrawMixin],
        middlewares: [doTextareaVerticalAlign, doVerticalAlign]
      })),
      image: React.createFactory(React.createClass({
        displayName: 'ReactODP.Image',
        mixins: [DrawMixin],
        middlewares: [doTextareaVerticalAlign, doVerticalAlign, makeInteractive]
      }))
    },
    text: {
      verticalAligner: React.createFactory(React.createClass({
        displayName: 'ReactODP.VerticalAligner',
        mixins: [DrawMixin],
        getDefaultProps: function(){
          return {
            htmlTag: 'span'
          };
        }
      })),
      p: React.createFactory(React.createClass({
        displayName: 'ReactODP.P',
        mixins: [DrawMixin],
        middlewares: [doTextareaVerticalAlign, doVerticalAlign, removeLineHeight]
      })),
      span: React.createFactory(React.createClass({
        displayName: 'ReactODP.Span',
        mixins: [DrawMixin],
        middlewares: [doTextareaVerticalAlign, doVerticalAlign, makeInteractive]
      })),
      lineBreak: React.createFactory(React.createClass({
        displayName: 'ReactODP.LineBreak',
        mixins: [DrawMixin],
        getDefaultProps: function(){
          return {
            htmlTag: 'br'
          };
        }
      }))
    }
  };
  lookup = function(node){
    var ref$;
    return (ref$ = defaultComponents[node.namespace]) != null ? ref$[node.name] : void 8;
  };
  render = function(node, scale, getComponent){
    var props, children, res$, i, ref$, c, comp;
    scale == null && (scale = 1.0);
    getComponent == null && (getComponent = lookup);
    switch (false) {
    case !!node:
      return null;
    default:
      props = cloneDeep(node.attrs);
      props.scale = scale;
      props.className = node.namespace + " " + node.name + " " + (props.className || '');
      res$ = [];
      for (i in ref$ = node.children) {
        c = ref$[i];
        c.attrs.ref = i;
        res$.push(render(c, scale, getComponent));
      }
      children = res$;
      if (node.text) {
        children.push(node.text);
      }
      comp = getComponent(node);
      return typeof comp === 'function' ? comp(props, children) : void 8;
    }
  };
  module.exports = {
    DrawMixin: DrawMixin,
    components: defaultComponents,
    renderProps: renderProps,
    scaleLength: scaleLength,
    render: render
  };
  function in$(x, xs){
    var i = -1, l = xs.length >>> 0;
    while (++i < l) if (x === xs[i]) return true;
    return false;
  }
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
  function importAll$(obj, src){
    for (var key in src) obj[key] = src[key];
    return obj;
  }
}).call(this);
