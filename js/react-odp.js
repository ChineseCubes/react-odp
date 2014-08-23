(function(){
  var isNumber, mapValues, span, NullMixin, DrawMixin, defaultComponents, ref$;
  isNumber = _.isNumber, mapValues = _.mapValues;
  span = React.DOM.span;
  NullMixin = {
    render: function(){
      return div();
    }
  };
  DrawMixin = {
    toHyphen: function(){},
    lowerCamelFromHyphenated: function(it){
      return it.split('-').map(function(v, i){
        switch (false) {
        case i !== 0:
          return v;
        default:
          return v.slice(0, 1).toUpperCase() + "" + v.slice(1);
        }
      }).join('');
    },
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
        components: {},
        classNames: ['draw'],
        scale: 1.0,
        children: []
      };
    },
    getInitialState: function(){
      return {
        defaultHtmlTag: 'div'
      };
    },
    render: function(){
      var classNames, style, props, children, res$, i$;
      classNames = this.props.classNames.concat(this.props.name || 'unknown');
      importAll$(style = {}, this.props.style);
      import$(style, {
        left: this.props.x || 'auto',
        top: this.props.y || 'auto',
        width: this.props.width || 'auto',
        height: this.props.height || 'auto'
      });
      style = mapValues(style, this.scaleStyle);
      if (this.props.href) {
        style.backgroundImage = "url(" + this.props.href + ")";
      }
      props = {
        className: classNames.join(' '),
        style: style
      };
      res$ = [];
      for (i$ in this.props.children) {
        res$.push((fn$.call(this, i$, this.props.children[i$])));
      }
      children = res$;
      if (this.props.name !== 'frame' && style.textareaVerticalAlign) {
        children.unshift(span({
          key: '-1',
          style: {
            display: 'inline-block',
            height: '100%',
            verticalAlign: style.textareaVerticalAlign
          }
        }));
      }
      if (this.props.text) {
        children.unshift(this.props.text);
      }
      return React.DOM[this.state.htmlTag || this.state.defaultHtmlTag](props, children);
      function fn$(i, child){
        var comps, comp, props, ref$;
        if (!child.name) {
          throw new Error('unknow tag name');
        }
        if (child.text) {
          return child.text;
        }
        import$(comps = clone$(defaultComponents), this.props.components);
        comp = comps[this.lowerCamelFromHyphenated(child.name)];
        if (comp) {
          props = {
            key: i,
            scale: this.props.scale,
            components: this.props.components,
            name: child.name,
            text: child.text,
            children: child.children
          };
          delete child.attrs.name;
          import$(props, child.attrs);
          if (style.textareaVerticalAlign) {
            import$((ref$ = props.style) != null
              ? ref$
              : props.style = {}, this.props.name === 'frame'
              ? {
                textareaVerticalAlign: style.textareaVerticalAlign
              }
              : {
                display: 'inline-block',
                verticalAlign: style.textareaVerticalAlign
              });
          }
          return comp(props);
        }
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
      getInitialState: function(){
        return {
          htmlTag: 'p'
        };
      }
    }),
    span: React.createClass({
      displayName: 'ReactODP.Span',
      mixins: [DrawMixin],
      getInitialState: function(){
        return {
          htmlTag: 'span'
        };
      }
    }),
    lineBreak: React.createClass({
      displayName: 'ReactODP.LineBreak',
      mixins: [DrawMixin],
      getInitialState: function(){
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
    DrawMixin: DrawMixin,
    renderComponent: function(data, element){
      return React.renderComponent(defaultComponents.presentation(data), element);
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
  function clone$(it){
    function fun(){} fun.prototype = it;
    return new fun;
  }
}).call(this);
