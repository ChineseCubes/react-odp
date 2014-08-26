(function(){
  var isArray, isString, cloneDeep, slice, x$, styles, masterPage$, masterPage, utils, ref$;
  isArray = _.isArray, isString = _.isString, cloneDeep = _.cloneDeep;
  slice = Array.prototype.slice;
  x$ = styles = {};
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
  x$.dp1 = {};
  x$.dp2 = {};
  x$.pr1 = Object.create(styles.DefaultTitle, {
    minHeight: {
      value: '3.506cm',
      enumerable: true
    }
  });
  x$.pr2 = Object.create(styles.DefaultNotes, {
    minHeight: {
      value: '13.364cm',
      enumerable: true
    }
  });
  x$.pr3 = Object.create(styles.DefaultTitle, {
    textareaVerticalAlign: {
      value: 'bottom',
      enumerable: true
    },
    minHeight: {
      value: '3.506cm',
      enumerable: true
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
  x$.Mgr3 = {
    textareaVerticalAlign: 'middle'
  };
  x$.Mgr4 = {
    textareaVerticalAlign: 'middle'
  };
  x$.MP4 = {
    textAlign: 'center',
    fontFamily: 'Noto Sans T Chinese',
    fontSize: '18pt'
  };
  masterPage$ = {
    children: [
      {
        name: 'frame',
        attrs: {
          'style-name': 'Mgr3',
          'text-style-name': 'MP4',
          x: '0.19cm',
          y: '0.22cm',
          width: '1.41cm',
          height: '1.198cm'
        },
        children: [{
          name: 'image',
          attrs: {
            href: 'Pictures/100002010000002800000022F506C368.png',
            onclick: 'home'
          }
        }]
      }, {
        name: 'frame',
        attrs: {
          'style-name': 'Mgr4',
          'text-style-name': 'MP4',
          x: '26.4cm',
          y: '0.4cm',
          width: '1.198cm',
          height: '1.198cm'
        },
        children: [{
          name: 'image',
          attrs: {
            href: 'Pictures/1000020100000022000000223520C9AB.png',
            onclick: 'activity'
          }
        }]
      }
    ]
  };
  masterPage = {
    frame: [
      {
        '@attributes': {
          'style-name': 'Mgr3',
          'text-style-name': 'MP4',
          x: '0.19cm',
          y: '0.22cm',
          width: '1.41cm',
          height: '1.198cm'
        },
        image: {
          '@attributes': {
            href: 'Pictures/100002010000002800000022F506C368.png'
          },
          p: {
            '@attributes': {
              'style-name': 'MP4'
            },
            span: 'home'
          }
        }
      }, {
        '@attributes': {
          'style-name': 'Mgr4',
          'text-style-name': 'MP4',
          x: '26.4cm',
          y: '0.4cm',
          width: '1.198cm',
          height: '1.198cm'
        },
        image: {
          '@attributes': {
            href: 'Pictures/1000020100000022000000223520C9AB.png'
          },
          p: {
            '@attributes': {
              'style-name': 'MP4'
            },
            span: 'activity'
          }
        }
      }
    ]
  };
  utils = {
    splitNamespace: function(it){
      var r;
      r = it.toLowerCase().split(':').reverse();
      return {
        namespace: r[1],
        name: r[0]
      };
    },
    getPageJSON: function(path, done){
      $.getJSON(path, function(data){
        var ref$, dir;
        data.children = data.children.concat(masterPage$.children);
        ref$ = /(.*\/)?(.*)\.json/.exec(path) || [void 8, ''], dir = ref$[1];
        return done(utils.transform(data, function(attrs, nodeName){
          var newAttrs, k, v, name, x$;
          attrs == null && (attrs = {});
          newAttrs = {};
          for (k in attrs) {
            v = attrs[k];
            if (!/^margin.*/.test(k)) {
              name = utils.splitNamespace(k).name;
              if (name === 'page-width') {
                name = 'width';
              }
              if (name === 'page-height') {
                name = 'height';
              }
              newAttrs[name] = v;
            }
          }
          if (nodeName === 'DRAW:FRAME') {
            console.log(styles[newAttrs['style-name']], attrs, nodeName);
          }
          x$ = newAttrs;
          if (newAttrs.href) {
            x$.href = dir + "" + newAttrs.href;
          }
          return x$;
        }));
      });
    },
    transform: function(node, onNode, parents){
      var child;
      onNode == null && (onNode = null);
      parents == null && (parents = []);
      return import$(utils.splitNamespace(node.name), {
        text: node.text,
        attrs: typeof onNode === 'function' ? onNode(node.attrs, node.name, parents) : void 8,
        children: !node.children
          ? []
          : (function(){
            var i$, ref$, len$, results$ = [];
            for (i$ = 0, len$ = (ref$ = node.children).length; i$ < len$; ++i$) {
              child = ref$[i$];
              results$.push(utils.transform(child, onNode, parents.concat([node.name])));
            }
            return results$;
          }())
      });
    }
  };
  import$((ref$ = this.CUBEBooks) != null
    ? ref$
    : this.CUBEBooks = {}, utils);
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
