(function(){
  var div, isArray, isString, isPlainObject, omit, pick, slice, DotsDetector, styles, x$, utils, ref$, isNumber, mapValues, NullMixin, DrawMixin, defaultComponents, this$ = this;
  div = React.DOM.div;
  isArray = _.isArray, isString = _.isString, isPlainObject = _.isPlainObject, omit = _.omit, pick = _.pick;
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
    textareaVerticalAlign: 'middle',
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
  x$.pr2 = Object.create(styles.DefaultNotes, {
    minHeight: {
      value: '13.364cm'
    }
  });
  x$.pr3 = Object.create(styles.DefaultTitle, {
    textareaVerticalAlign: {
      value: 'bottom'
    },
    minHeight: {
      value: '3.506cm'
    }
  });
  x$.gr1 = {
    verticalAlign: 'middle',
    opacity: 1.0
  };
  x$.gr2 = {};
  x$.P1 = {
    textAlign: 'start',
    fontFamily: 'Noto Sans T Chinese'
  };
  x$.P2 = {
    textAlign: 'center'
  };
  x$.P3 = {
    fontFamily: 'Noto Sans T Chinese'
  };
  x$.P4 = {
    fontSize: '20pt'
  };
  x$.P5 = {
    fontFamily: 'cwTeX Q KaiZH'
  };
  x$.P6 = {
    marginTop: '0cm',
    marginBottom: '0cm',
    lineHeight: '150%',
    fontSize: '30pt'
  };
  x$.P7 = {
    marginTop: '0cm',
    marginBottom: '0cm',
    lineHeight: '150%',
    fontFamily: 'Noto Sans T Chinese',
    fontSize: '30pt'
  };
  x$.P8 = {
    lineHeight: '150%',
    fontSize: '24pt'
  };
  x$.P9 = {
    lineHeight: '150%',
    fontFamily: 'Noto Sans T Chinese',
    fontSize: '24pt'
  };
  x$.T1 = {
    fontFamily: 'Noto Sans T Chinese'
  };
  x$.T2 = {
    fontFamily: 'cwTeX Q KaiZH'
  };
  x$.T3 = {
    fontFamily: 'Noto Sans T Chinese',
    fontSize: '30pt'
  };
  x$.T4 = {
    fontFamily: 'Noto Sans T Chinese',
    fontSize: '24pt'
  };
  utils = {
    DotsDetector: DotsDetector,
    getPageJSON: function(path, done){
      $.getJSON(path, function(data){
        var frameCount, spanCount, pCount, ref$, dir, file, tree;
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
        pCount = 0;
        ref$ = /(.*\/)?(.*)\.json/.exec(path) || [void 8, '', ''], dir = ref$[1], file = ref$[2];
        tree = utils.map(data, function(value, key, parents){
          var attrs, x$, y$, z$, z1$, z2$, z3$, z4$, z5$, z6$, z7$, z8$, z9$, z10$, z11$, z12$, z13$, z14$, z15$, z16$, z17$, z18$, z19$;
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
            break;
          case 'page2':
            switch (key) {
            case 'frame':
              switch (frameCount) {
              case 0:
                z$ = attrs;
                z$.style = styles.pr1;
                z$.textStyle = styles.P3;
                break;
              case 1:
                z1$ = attrs;
                z1$.style = styles.gr1;
                z1$.textStyle = styles.P2;
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
            break;
          case 'page3':
            switch (key) {
            case 'frame':
              switch (frameCount) {
              case 0:
                z2$ = attrs;
                z2$.style = styles.gr1;
                z2$.textStyle = styles.P2;
                break;
              case 1:
                z3$ = attrs;
                z3$.style = styles.pr3;
                z3$.textStyle = styles.P3;
                break;
              case 2:
                z4$ = attrs;
                z4$.style = styles.pr2;
                z4$.textStyle = styles.P4;
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
            break;
          case 'page4':
            switch (key) {
            case 'frame':
              switch (frameCount) {
              case 0:
                z5$ = attrs;
                z5$.style = styles.pr1;
                z5$.textStyle = styles.P5;
                break;
              case 1:
                z6$ = attrs;
                z6$.style = styles.gr1;
                z6$.textStyle = styles.P2;
                break;
              case 2:
                z7$ = attrs;
                z7$.style = styles.pr2;
                z7$.textStyle = styles.P4;
              }
              frameCount += 1;
              break;
            case 'span':
              switch (spanCount) {
              case 0:
                attrs.style = styles.T2;
              }
              spanCount += 1;
              break;
            case 'p':
              switch (pCount) {
              case 0:
                attrs.style = styles.P5;
                break;
              case 2:
                attrs.style = styles.P4;
              }
              pCount += 1;
            }
            break;
          case 'page5':
            switch (key) {
            case 'frame':
              switch (frameCount) {
              case 0:
                z8$ = attrs;
                z8$.style = styles.pr1;
                z8$.textStyle = styles.P7;
                break;
              case 1:
                z9$ = attrs;
                z9$.style = styles.gr1;
                z9$.textStyle = styles.P2;
                break;
              case 2:
                z10$ = attrs;
                z10$.style = styles.pr2;
                z10$.textStyle = styles.P4;
              }
              frameCount += 1;
              break;
            case 'span':
              attrs.style = styles.T3;
              break;
            case 'p':
              switch (pCount) {
              case 0:
                attrs.style = styles.P6;
                break;
              case 2:
                attrs.style = styles.P4;
                break;
              case 3:
                attrs.style = styles.P4;
              }
            }
            break;
          case 'page6':
            switch (key) {
            case 'frame':
              switch (frameCount) {
              case 0:
                z11$ = attrs;
                z11$.style = styles.pr1;
                z11$.textStyle = styles.P3;
                break;
              case 1:
                z12$ = attrs;
                z12$.style = styles.gr1;
                z12$.textStyle = styles.P2;
                break;
              case 2:
                z13$ = attrs;
                z13$.style = styles.pr2;
                z13$.textStyle = styles.P4;
              }
              frameCount += 1;
              break;
            case 'span':
              switch (spanCount) {
              case 0:
                attrs.style = styles.T1;
              }
              spanCount += 1;
              break;
            case 'p':
              switch (pCount) {
              case 2:
                attrs.style = styles.P4;
              }
            }
            break;
          case 'page7':
            switch (key) {
            case 'frame':
              switch (frameCount) {
              case 0:
                z14$ = attrs;
                z14$.style = styles.gr1;
                z14$.textStyle = styles.P2;
                break;
              case 1:
                z15$ = attrs;
                z15$.style = styles.pr1;
                z15$.textStyle = styles.P9;
                break;
              case 2:
                z16$ = attrs;
                z16$.style = styles.pr2;
                z16$.textStyle = styles.P4;
              }
              frameCount += 1;
              break;
            case 'span':
              attrs.style = styles.T4;
              break;
            case 'p':
              switch (pCount) {
              case 1:
                attrs.style = styles.P8;
              }
              pCount += 1;
            }
            break;
          case 'page8':
            switch (key) {
            case 'frame':
              switch (frameCount) {
              case 0:
                z17$ = attrs;
                z17$.style = styles.pr1;
                z17$.textStyle = styles.P9;
                break;
              case 1:
                z18$ = attrs;
                z18$.style = styles.gr1;
                z18$.textStyle = styles.P2;
                break;
              case 2:
                z19$ = attrs;
                z19$.style = styles.pr2;
                z19$.textStyle = styles.P4;
              }
              frameCount += 1;
              break;
            case 'span':
              attrs.style = styles.T4;
              break;
            case 'p':
              switch (pCount) {
              case 0:
                attrs.style = styles.P8;
              }
              pCount += 1;
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
            if (!isString(obj)) {
              utils.each(obj, onNode, parents);
            }
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
            nodes.push(isString(obj)
              ? {
                text: obj
              }
              : {
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
  isNumber = _.isNumber, mapValues = _.mapValues;
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
      return React.DOM[this.state.htmlTag || this.state.defaultHtmlTag](props, this.props.text, children);
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
          if (style.textareaVerticalAlign && child.tagName === 'text-box') {
            import$((ref$ = props.style) != null
              ? ref$
              : props.style = {}, {
              display: 'table',
              textareaVerticalAlign: style.textareaVerticalAlign
            });
          }
          if (this.props.tagName === 'text-box' && style.display === 'table') {
            import$((ref$ = props.style) != null
              ? ref$
              : props.style = {}, {
              display: 'table-cell',
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
      mixins: [DrawMixin],
      getInitialState: function(){
        return {
          htmlTag: 'img'
        };
      }
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
