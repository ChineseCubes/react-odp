(function(){
  var React, camelFromHyphenated, ref$, isArray, isString, isNumber, filter, map, mapValues, cloneDeep, renderProps, doTextareaVerticalAlign, fromVerticalAlign, doVerticalAlign, removeLineHeight, makeInteractive, DrawMixin, defaultComponents;
  React = require('react');
  camelFromHyphenated = require('../CUBE/utils').camelFromHyphenated;
  ref$ = require('lodash'), isArray = ref$.isArray, isString = ref$.isString, isNumber = ref$.isNumber, filter = ref$.filter, map = ref$.map, mapValues = ref$.mapValues, cloneDeep = ref$.cloneDeep;
  renderProps = function(it){
    var key$;
    return typeof defaultComponents[key$ = camelFromHyphenated(it.data.name)] === 'function' ? defaultComponents[key$](it) : void 8;
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
      var r;
      switch (false) {
      case !in$(key, ['opacity']):
        return value;
      case !isNumber(value):
        return value * this.props.scale;
      case !/^-?\d*\.?\d+%$/.test(value):
        return value;
      case !(r = /^(-?\d*\.?\d+)(in|cm|mm|px|pc|pt)?$/.exec(value)):
        return +r[1] * this.props.scale + "" + (r[2] || '');
      default:
        return value;
      }
    },
    getDefaultProps: function(){
      return {
        defaultHtmlTag: 'div',
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
    componentWillMount: function(){
      return this.applyMiddlewares(this.props.data);
    },
    componentWillReceiveProps: function(arg$){
      var data;
      data = arg$.data;
      return this.applyMiddlewares(data);
    },
    render: function(){
      var data, attrs, ref$, style, props, key, attr, childPropsList, res$, i$, children;
      if (!(data = this.props.data)) {
        return;
      }
      attrs = data.attrs;
      if ((attrs != null ? (ref$ = attrs.style) != null ? ref$.display : void 8 : void 8) === 'none' && attrs.href) {
        return React.DOM.div({});
      }
      style = {
        left: (attrs != null ? attrs.x : void 8) || 'auto',
        top: (attrs != null ? attrs.y : void 8) || 'auto',
        width: (attrs != null ? attrs.width : void 8) || 'auto',
        height: (attrs != null ? attrs.height : void 8) || 'auto'
      };
      if (attrs != null) {
        importAll$(style, attrs.style);
      }
      style = mapValues(style, this.scaleStyle);
      if (attrs.href) {
        style.backgroundImage = "url(" + attrs.href + ")";
      }
      props = {
        className: data.namespace + " " + data.name + " " + (attrs.className || ''),
        style: style
      };
      for (key in attrs) {
        attr = attrs[key];
        if (/^on.*$/.test(key)) {
          props[key] = attr;
        }
      }
      res$ = [];
      for (i$ in data.children) {
        res$.push((fn$.call(this, i$, data.children[i$])));
      }
      childPropsList = res$;
      children = filter(
      map(childPropsList, this.props.renderProps));
      if (data.text) {
        children.unshift(data.text);
      }
      return React.DOM[this.props.htmlTag || this.props.defaultHtmlTag](props, children.concat(this.props.children));
      function fn$(i, child){
        return {
          key: i,
          scale: this.props.scale,
          parents: this.props.parents.concat([{
            tag: data.name,
            name: attrs.name
          }]),
          data: cloneDeep(child),
          renderProps: this.props.renderProps
        };
      }
    }
  };
  defaultComponents = {
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
    })),
    presentation: React.createFactory(React.createClass({
      displayName: 'ReactODP.Presentation',
      mixins: [DrawMixin]
    })),
    verticalAligner: React.createFactory(React.createClass({
      displayName: 'ReactODP.VerticalAligner',
      mixins: [DrawMixin],
      getDefaultProps: function(){
        return {
          htmlTag: 'span'
        };
      }
    }))
  };
  module.exports = {
    DrawMixin: DrawMixin,
    components: defaultComponents,
    renderProps: renderProps
  };
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
  function in$(x, xs){
    var i = -1, l = xs.length >>> 0;
    while (++i < l) if (x === xs[i]) return true;
    return false;
  }
  function importAll$(obj, src){
    for (var key in src) obj[key] = src[key];
    return obj;
  }
}).call(this);
