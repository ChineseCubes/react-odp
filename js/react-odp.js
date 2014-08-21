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
    toUpperCamel: function(it){
      return it.split('-').map(function(it){
        return it.slice(0, 1).toUpperCase() + "" + it.slice(1);
      }).join('');
    },
    toLowerCamel: function(it){
      it = this.toUpperCamel(it);
      it[0] = it[0].toLowerCase();
      return it;
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
      classNames = this.props.classNames.concat(this.props.tagName || 'unknown');
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
      if (this.props.tagName !== 'frame' && style.textareaVerticalAlign) {
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
        var comp, props, ref$;
        if (child.text) {
          return child.text;
        }
        comp = defaultComponents[this.toUpperCamel(child.tagName)];
        if (comp) {
          props = {
            key: i,
            tagName: child.tagName,
            text: child.text,
            scale: this.props.scale,
            children: child.children
          };
          import$(props, child.attrs);
          if (style.textareaVerticalAlign) {
            import$((ref$ = props.style) != null
              ? ref$
              : props.style = {}, this.props.tagName === 'frame'
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
    Page: React.createClass({
      displayName: 'ReactODP.Page',
      mixins: [DrawMixin]
    }),
    Frame: React.createClass({
      displayName: 'ReactODP.Frame',
      mixins: [DrawMixin]
    }),
    TextBox: React.createClass({
      displayName: 'ReactODP.TextBox',
      mixins: [DrawMixin]
    }),
    Image: React.createClass({
      displayName: 'ReactODP.Image',
      mixins: [DrawMixin]
    }),
    P: React.createClass({
      displayName: 'ReactODP.P',
      mixins: [DrawMixin],
      getInitialState: function(){
        return {
          htmlTag: 'p'
        };
      }
    }),
    Span: React.createClass({
      displayName: 'ReactODP.Span',
      mixins: [DrawMixin],
      getInitialState: function(){
        return {
          htmlTag: 'span'
        };
      }
    }),
    LineBreak: React.createClass({
      displayName: 'ReactODP.LineBreak',
      mixins: [DrawMixin],
      getInitialState: function(){
        return {
          htmlTag: 'br'
        };
      }
    }),
    Presentation: React.createClass({
      displayName: 'ReactODP.Presentation',
      mixins: [DrawMixin]
    })
  };
  import$((ref$ = this.ODP) != null
    ? ref$
    : this.ODP = {}, defaultComponents);
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
