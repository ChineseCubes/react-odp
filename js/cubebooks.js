(function(){
  var isArray, isString, isPlainObject, cloneDeep, slice, x$, styles, masterPage, utils, ref$, this$ = this;
  isArray = _.isArray, isString = _.isString, isPlainObject = _.isPlainObject, cloneDeep = _.cloneDeep;
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
    textAlign: 'center'
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
            '@attibutes': {
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
            '@attibutes': {
              'style-name': 'MP4'
            },
            span: 'activity'
          }
        }
      }
    ]
  };
  utils = {
    getPageJSON: function(path, done){
      $.getJSON(path, function(data){
        var ref$, dir;
        data.frame = cloneDeep(masterPage.frame).concat(data.frame);
        ref$ = data['@attributes'];
        ref$.x = '0';
        ref$.y = '0';
        ref$.width = '28cm';
        ref$.height = '21cm';
        ref$ = /(.*\/)?(.*)\.json/.exec(path) || [void 8, ''], dir = ref$[1];
        return done(utils.map({
          page: data
        }, function(it){
          var x$, attrs;
          x$ = attrs = it['@attributes'] || {};
          x$.style = styles[attrs['style-name']];
          x$.textStyle = styles[attrs['text-style-name']];
          if (attrs.href) {
            x$.href = dir + "" + attrs.href;
          }
          return x$;
        }));
      });
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
  import$((ref$ = this.CUBEBooks) != null
    ? ref$
    : this.CUBEBooks = {}, utils);
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
