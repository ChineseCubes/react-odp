(function(){
  var div, isArray, isString, isPlainObject, slice, DotsDetector, styles, x$, utils, ref$, isNumber, NullMixin, DrawMixin, defaultComponents, this$ = this;
  div = React.DOM.div;
  isArray = _.isArray, isString = _.isString, isPlainObject = _.isPlainObject;
  slice = Array.prototype.slice;
  DotsDetector = React.createClass({
    displayName: 'UnitDetector',
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
  styles = {};
  x$ = styles;
  x$.DefaultTitle = {
    lineHeight: '150%',
    textAlign: 'center',
    fontFamily: 'Noto Sans T Chinese, Heiti TC, Arial Unicode MS',
    fontSize: '44pt',
    fontWeight: 'normal',
    textShadow: 'none'
  };
  x$.DefaultNotes = {
    marginLeft: '0.6cm',
    marginRight: '0cm',
    textIndent: '-0.6cm',
    fontFamily: 'Liberation Sans, Heiti TC, Arial Unicode MS',
    fontSize: '20pt',
    fontWeight: 'normal',
    textShadow: 'none'
  };
  x$.pr1 = Object.create(styles.DefaultTitle, {
    minHeight: {
      value: '3.506cm'
    }
  });
  x$.pr2 = Object.create(styles.DefaultNotes, {});
  x$.gr1 = {
    verticalAlign: 'middle',
    opacity: 1.0
  };
  x$.P1 = {
    textAlign: 'left',
    fontFamily: 'Noto Sans T Chinese'
  };
  x$.P2 = {
    textAlign: 'center'
  };
  x$.T1 = {
    fontFamily: 'Noto Sans T Chinese'
  };
  utils = {
    DotsDetector: DotsDetector,
    getPageJSON: function(path, done){
      $.getJSON(path, function(data){
        var frameCount, spanCount, ref$, dir, file, tree;
        import$(data['@attributes'], {
          x: '0',
          y: '0',
          width: '28cm',
          height: '21cm'
        });
        data = {
          page: data
        };
        frameCount = 0;
        spanCount = 0;
        ref$ = /(.*\/)?(.*)\.json/.exec(path) || [void 8, '', ''], dir = ref$[1], file = ref$[2];
        tree = utils.map(data, function(value, key, parents){
          var attrs, x$, y$;
          attrs = value['@attributes'] || {};
          switch (file) {
          case 'page1':
            switch (key) {
            case 'frame':
              switch (frameCount) {
              case 0:
                x$ = attrs;
                x$.style = styles.pr1;
                x$.textStyle = styles.P1;
                break;
              case 1:
                y$ = attrs;
                y$.style = styles.gr1;
                y$.textStyle = styles.P2;
                break;
              case 2:
                attrs.style = styles.pr2;
              }
              frameCount += 1;
              break;
            case 'span':
              switch (spanCount) {
              case 0:
                attrs.style = styles.T1;
              }
              spanCount += 1;
            }
          }
          if (attrs.href) {
            attrs.href = dir + "" + attrs.href;
          }
          return attrs;
        });
        return done(tree);
      });
    },
    each: function(bookJson, onNode, parents){
      var oldParents, k, v, idx, obj;
      parents == null && (parents = []);
      oldParents = slice.call(parents);
      for (k in bookJson) {
        v = bookJson[k];
        parents.push(k);
        switch (false) {
        case k !== "@attributes":
          break;
        case !isString(v):
          break;
        case !isPlainObject(v):
          onNode(v, k, slice.call(oldParents));
          utils.each(v, onNode, parents);
          break;
        case !isArray(v):
          for (idx in v) {
            obj = v[idx];
            onNode(obj, k, slice.call(oldParents));
            utils.each(obj, onNode, parents);
          }
          break;
        default:
          throw new Error('ill formated JSON');
        }
        parents.pop();
      }
    },
    map: function(bookJson, onNode, parents){
      var nodes, oldParents, k, v, idx, obj;
      parents == null && (parents = []);
      nodes = [];
      oldParents = slice.call(parents);
      for (k in bookJson) {
        v = bookJson[k];
        parents.push(k);
        switch (false) {
        case k !== "@attributes":
          break;
        case !isString(v):
          nodes.push({
            tagName: k,
            attrs: {},
            text: v
          });
          break;
        case !isPlainObject(v):
          nodes.push({
            tagName: k,
            attrs: onNode(v, k, slice.call(oldParents)),
            children: utils.map(v, onNode, parents)
          });
          break;
        case !isArray(v):
          for (idx in v) {
            obj = v[idx];
            nodes.push({
              tagName: k,
              attrs: onNode(obj, k, slice.call(oldParents)),
              children: utils.map(obj, onNode, parents)
            });
          }
          break;
        default:
          throw new Error('ill formated JSON');
        }
        parents.pop();
      }
      return nodes;
    }
  };
  import$((ref$ = this.ODP) != null
    ? ref$
    : this.ODP = {}, utils);
  div = React.DOM.div;
  isNumber = _.isNumber;
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
    scaleStyle: function(it){
      var r;
      switch (false) {
      case !!it:
        return it;
      case !isNumber(it):
        return it * this.props.scale;
      case !/\d*\.?\d+%$/.test(it):
        return it;
      case !(r = /(\d*\.?\d+)(in|cm|mm|px|pc|pt)?$/.exec(it)):
        return +r[1] * this.props.scale + "" + (r[2] || '');
      default:
        throw new Error("style \"" + it + "\" should be a length");
      }
    },
    getDefaultProps: function(){
      return {
        classNames: ['draw'],
        scale: 1.0,
        children: []
      };
    },
    render: function(){
      var children, res$, i$, classNames, props, ref$;
      res$ = [];
      for (i$ in this.props.children) {
        res$.push((fn$.call(this, i$, this.props.children[i$])));
      }
      children = res$;
      classNames = this.props.classNames.concat(this.props.tagName || 'unknown');
      props = {
        className: classNames.join(' '),
        style: {
          left: this.scaleStyle(this.props.x) || 'auto',
          top: this.scaleStyle(this.props.y) || 'auto',
          width: this.scaleStyle(this.props.width) || 'auto',
          height: this.scaleStyle(this.props.height) || 'auto',
          fontSize: this.scaleStyle(this.props.fontSize) || '44pt',
          fontFamily: (ref$ = this.props.style) != null ? ref$.fontFamily : void 8
        }
      };
      if (this.props.href) {
        props.style.backgroundImage = "url(" + this.props.href + ")";
      }
      return React.DOM[this.state.tag](props, this.props.text, children);
      function fn$(i, child){
        var comp, props;
        comp = defaultComponents[this.toUpperCamel(child.tagName)];
        if (comp) {
          if (this.props.textStyle) {
            child.attrs.textStyle = this.props.textStyle;
          }
          props = {
            key: i,
            tagName: child.tagName,
            text: child.text,
            scale: this.props.scale,
            children: child.children
          };
          import$(props, child.attrs);
          return comp(props);
        }
      }
    }
  };
  defaultComponents = {
    Page: React.createClass({
      displayName: 'ReactODP.Page',
      mixins: [DrawMixin],
      getInitialState: function(){
        return {
          tag: 'div'
        };
      }
    }),
    Frame: React.createClass({
      displayName: 'ReactODP.Frame',
      mixins: [DrawMixin],
      getInitialState: function(){
        return {
          tag: 'div'
        };
      }
    }),
    TextBox: React.createClass({
      displayName: 'ReactODP.TextBox',
      mixins: [DrawMixin],
      getInitialState: function(){
        return {
          tag: 'div'
        };
      }
    }),
    Image: React.createClass({
      displayName: 'ReactODP.Image',
      mixins: [DrawMixin],
      getInitialState: function(){
        return {
          tag: 'img'
        };
      }
    }),
    P: React.createClass({
      displayName: 'ReactODP.P',
      mixins: [DrawMixin],
      getInitialState: function(){
        return {
          tag: 'p'
        };
      }
    }),
    Span: React.createClass({
      displayName: 'ReactODP.P',
      mixins: [DrawMixin],
      getInitialState: function(){
        return {
          tag: 'span'
        };
      }
    }),
    Presentation: React.createClass({
      displayName: 'ReactODP.Presentation',
      mixins: [DrawMixin],
      getInitialState: function(){
        return {
          tag: 'div'
        };
      }
    })
  };
  import$((ref$ = this.ODP) != null
    ? ref$
    : this.ODP = {}, defaultComponents);
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
