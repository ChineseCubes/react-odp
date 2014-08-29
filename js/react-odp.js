(function(){
  var isArray, isString, isNumber, filter, map, mapValues, cloneDeep, span, camelFromHyphenated, renderProps, doTextareaVerticalAlign, doVerticalAlign, DrawMixin, defaultComponents, ref$;
  isArray = _.isArray, isString = _.isString, isNumber = _.isNumber, filter = _.filter, map = _.map, mapValues = _.mapValues, cloneDeep = _.cloneDeep;
  span = React.DOM.span;
  camelFromHyphenated = function(it){
    return it.split('-').map(function(v, i){
      switch (false) {
      case i !== 0:
        return v;
      default:
        return v.slice(0, 1).toUpperCase() + "" + v.slice(1);
      }
    }).join('');
  };
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
        : ref$.style = {}, it.name === 'frame'
        ? {
          textareaVerticalAlign: style.textareaVerticalAlign
        }
        : {
          display: 'inline-block',
          verticalAlign: style.textareaVerticalAlign
        });
    }
  };
  doVerticalAlign = function(it){
    var ref$, ref1$, style;
    if ((it != null ? it.name : void 8) === 'frame') {
      return;
    }
    console.log(it.name);
    if (!(it != null && ((ref$ = it.attrs) != null && ((ref1$ = ref$.style) != null && ref1$.textareaVerticalAlign)))) {
      return;
    }
    console.log(it);
    style = it.attrs.style;
    it.children.unshift({
      name: 'vertical-aligner',
      attrs: {
        style: {
          display: 'inline-block',
          height: '100%',
          verticalAlign: style.textareaVerticalAlign
        }
      },
      children: []
    });
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
      case !/\d*\.?\d+%$/.test(value):
        return value;
      case !(r = /(\d*\.?\d+)(in|cm|mm|px|pc|pt)?$/.exec(value)):
        return +r[1] * this.props.scale + "" + (r[2] || '');
      default:
        return value;
      }
    },
    getDefaultProps: function(){
      return {
        defaultHtmlTag: 'div',
        classNames: ['draw'],
        scale: 1.0,
        parents: [],
        renderProps: renderProps
      };
    },
    componentWillMount: function(){
      var i$, ref$, len$, f, results$ = [];
      if (isArray(this.middlewares)) {
        for (i$ = 0, len$ = (ref$ = this.middlewares).length; i$ < len$; ++i$) {
          f = ref$[i$];
          results$.push(f(this.props.data));
        }
        return results$;
      }
    },
    render: function(){
      var data, attrs, style, props, x$, childPropsList, res$, i$, children, this$ = this;
      if (!(data = this.props.data)) {
        return;
      }
      attrs = data.attrs;
      style = {
        left: (attrs != null ? attrs.x : void 8) || 'auto',
        top: (attrs != null ? attrs.y : void 8) || 'auto',
        width: (attrs != null ? attrs.width : void 8) || 'auto',
        height: (attrs != null ? attrs.height : void 8) || 'auto'
      };
      if (attrs != null) {
        importAll$(style, attrs.style);
      }
      delete style.lineHeight;
      style = mapValues(style, this.scaleStyle);
      if (attrs.href) {
        style.backgroundImage = "url(" + attrs.href + ")";
      }
      props = {
        className: this.props.classNames.concat(data.name || 'unknown').join(' '),
        style: style
      };
      if (isString(attrs.onclick)) {
        x$ = props;
        x$.style.cursor = 'pointer';
        x$.onClick = function(){
          return alert(attrs.onclick);
        };
      }
      res$ = [];
      for (i$ in data.children) {
        res$.push((fn$.call(this, i$, data.children[i$])));
      }
      childPropsList = res$;
      children = filter(
      map(childPropsList, this.props.renderProps));
      console.log(children);
      if (data.text) {
        children.unshift(data.text);
      }
      return React.DOM[this.props.htmlTag || this.props.defaultHtmlTag](props, children.concat(this.props.children));
      function fn$(i, child){
        var props;
        if (!child.name) {
          throw new Error('unknow tag name');
        }
        props = {
          key: i,
          scale: this.props.scale,
          parents: this.props.parents.concat([data.name]),
          data: cloneDeep(child),
          renderProps: this.props.renderProps
        };
        return props;
      }
    }
  };
  defaultComponents = {
    page: React.createClass({
      displayName: 'ReactODP.Page',
      mixins: [DrawMixin]
    }),
    frame: React.createClass({
      displayName: 'ReactODP.Frame',
      mixins: [DrawMixin],
      middlewares: [doTextareaVerticalAlign]
    }),
    textBox: React.createClass({
      displayName: 'ReactODP.TextBox',
      mixins: [DrawMixin],
      middlewares: [doTextareaVerticalAlign, doVerticalAlign]
    }),
    image: React.createClass({
      displayName: 'ReactODP.Image',
      mixins: [DrawMixin],
      middlewares: [doTextareaVerticalAlign, doVerticalAlign]
    }),
    p: React.createClass({
      displayName: 'ReactODP.P',
      mixins: [DrawMixin],
      middlewares: [doTextareaVerticalAlign, doVerticalAlign],
      getDefaultProps: function(){
        return {
          htmlTag: 'p'
        };
      }
    }),
    span: React.createClass({
      displayName: 'ReactODP.Span',
      mixins: [DrawMixin],
      middlewares: [doTextareaVerticalAlign, doVerticalAlign],
      getDefaultProps: function(){
        return {
          htmlTag: 'span'
        };
      }
    }),
    lineBreak: React.createClass({
      displayName: 'ReactODP.LineBreak',
      mixins: [DrawMixin],
      getDefaultProps: function(){
        return {
          htmlTag: 'br'
        };
      }
    }),
    presentation: React.createClass({
      displayName: 'ReactODP.Presentation',
      mixins: [DrawMixin]
    }),
    verticalAligner: React.createClass({
      displayName: 'ReactODP.VerticalAligner',
      mixins: [DrawMixin],
      getDefaultProps: function(){
        return {
          htmlTag: 'span'
        };
      },
      componentWillReceiveProps: function(){
        return consol.log('hello');
      }
    })
  };
  import$((ref$ = this.ODP) != null
    ? ref$
    : this.ODP = {}, {
    DrawMixin: DrawMixin,
    components: defaultComponents,
    camelFromHyphenated: camelFromHyphenated,
    renderProps: renderProps
  });
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
