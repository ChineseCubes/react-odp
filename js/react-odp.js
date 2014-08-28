(function(){
  var isString, isNumber, filter, map, mapValues, cloneDeep, span, camelFromHyphenated, renderProps, DrawMixin, defaultComponents, ref$;
  isString = _.isString, isNumber = _.isNumber, filter = _.filter, map = _.map, mapValues = _.mapValues, cloneDeep = _.cloneDeep;
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
  renderProps = function(props){
    var key$;
    return typeof defaultComponents[key$ = camelFromHyphenated(props.data.name)] === 'function' ? defaultComponents[key$](props) : void 8;
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
      if (data.name !== 'frame' && style.textareaVerticalAlign) {
        children.unshift(span({
          key: '-1',
          style: {
            display: 'inline-block',
            height: '100%',
            verticalAlign: style.textareaVerticalAlign
          }
        }));
      }
      if (data.text) {
        children.unshift(data.text);
      }
      return React.DOM[this.props.htmlTag || this.props.defaultHtmlTag](props, children);
      function fn$(i, child){
        var props, ref$, ref1$;
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
        if (style.textareaVerticalAlign) {
          import$((ref1$ = (ref$ = props.data.attrs).style) != null
            ? ref1$
            : ref$.style = {}, data.name === 'frame'
            ? {
              textareaVerticalAlign: style.textareaVerticalAlign
            }
            : {
              display: 'inline-block',
              verticalAlign: style.textareaVerticalAlign
            });
        }
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
      mixins: [DrawMixin]
    }),
    textBox: React.createClass({
      displayName: 'ReactODP.TextBox',
      mixins: [DrawMixin]
    }),
    image: React.createClass({
      displayName: 'ReactODP.Image',
      mixins: [DrawMixin]
    }),
    p: React.createClass({
      displayName: 'ReactODP.P',
      mixins: [DrawMixin],
      getDefaultProps: function(){
        return {
          htmlTag: 'p'
        };
      }
    }),
    span: React.createClass({
      displayName: 'ReactODP.Span',
      mixins: [DrawMixin],
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
    })
  };
  import$((ref$ = this.ODP) != null
    ? ref$
    : this.ODP = {}, {
    mixin: DrawMixin,
    components: defaultComponents,
    camelFromHyphenated: camelFromHyphenated,
    renderProps: renderProps,
    renderComponent: function(data, element){
      return React.renderComponent(defaultComponents.presentation({
        data: data
      }), element);
    }
  });
  function in$(x, xs){
    var i = -1, l = xs.length >>> 0;
    while (++i < l) if (x === xs[i]) return true;
    return false;
  }
  function importAll$(obj, src){
    for (var key in src) obj[key] = src[key];
    return obj;
  }
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
