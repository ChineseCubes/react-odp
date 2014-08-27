(function(){
  var isArray, isString, cloneDeep, slice, masterPage, utils, ref$;
  isArray = _.isArray, isString = _.isString, cloneDeep = _.cloneDeep;
  slice = Array.prototype.slice;
  masterPage = {
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
  utils = {
    splitNamespace: function(it){
      var r;
      r = it.toLowerCase().split(':').reverse();
      return {
        namespace: r[1],
        name: r[0]
      };
    },
    getPresentation: function(path, done){
      var pages, counter, gotOne, i$, results$ = [];
      pages = [];
      counter = 0;
      gotOne = function(data, i){
        data.attrs.y = i * 21.5 + "cm";
        pages.push(data);
        counter += 1;
        if (counter === 8) {
          return done({
            name: 'presentation',
            x: '0',
            y: '0',
            width: '28cm',
            height: '21cm',
            children: pages
          });
        }
      };
      for (i$ = 1; i$ <= 8; ++i$) {
        results$.push((fn$.call(this, i$)));
      }
      return results$;
      function fn$(i){
        return CUBEBooks.getPageJSON(path + "/page" + i + ".json", function(it){
          return gotOne(it, i - 1);
        });
      }
    },
    getPageJSON: function(path, done){
      $.getJSON(path, function(data){
        var ref$, dir;
        data.children = data.children.concat(masterPage.children);
        ref$ = /(.*\/)?(.*)\.json/.exec(path) || [void 8, ''], dir = ref$[1];
        return done(utils.transform(data, function(attrs, nodeName, parents){
          var newAttrs, k, v, name, x$;
          attrs == null && (attrs = {});
          newAttrs = {
            style: {}
          };
          for (k in attrs) {
            v = attrs[k];
            if (!/^margin.*/.test(k)) {
              name = utils.splitNamespace(k).name;
              switch (name) {
              case 'page-width':
                newAttrs.width = v;
                break;
              case 'page-height':
                newAttrs.height = v;
                break;
              case 'width':
                newAttrs.width = v;
                break;
              case 'height':
                newAttrs.height = v;
                break;
              case 'x':
                newAttrs.x = v;
                break;
              case 'y':
                newAttrs.y = v;
                break;
              case 'href':
                newAttrs.href = v;
              }
              newAttrs.style[ODP.camelFromHyphenated(name)] = v;
            }
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
