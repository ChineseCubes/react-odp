(function(){
  var fs, ref$, isArray, isString, flatten, max, min, map, zipObject, unslash, tagless, splitNamespace, camelFromHyphenated, notoName, slice, shadow, masterPage, c, Char, o, Node, punctuations, Dict, Segmentations, Data;
  try {
    fs = require('fs');
  } catch (e$) {}
  fs == null && (fs = {
    readFile: function(path, done){
      return $.get(path, null, function(data){
        return done(null, data);
      }, 'text');
    }
  });
  ref$ = require('lodash'), isArray = ref$.isArray, isString = ref$.isString, flatten = ref$.flatten, max = ref$.max, min = ref$.min, map = ref$.map, zipObject = ref$.zipObject;
  ref$ = require('./utils'), unslash = ref$.unslash, tagless = ref$.strip, splitNamespace = ref$.splitNamespace, camelFromHyphenated = ref$.camelFromHyphenated, notoName = ref$.notoName;
  slice = Array.prototype.slice;
  shadow = '0 0 5px 5px rgba(0,0,0,0.1);';
  masterPage = {
    children: {
      name: 'draw:frame',
      attrs: {
        'style-name': 'Mgr4',
        'text-style-name': 'MP4',
        x: '25.16cm',
        y: '1.35cm',
        width: '1.458cm',
        height: '1.358cm'
      },
      children: [{
        name: 'draw:image',
        attrs: {
          name: 'activity',
          href: '../images/play.png',
          'on-click': function(){
            throw Error('unimplemented');
          },
          'font-size': '1cm'
        }
      }]
    }
  };
  c = Char = (function(){
    Char.displayName = 'Char';
    var prototype = Char.prototype, constructor = Char;
    function Char(pinyin, arg$, arg1$){
      var this$ = this instanceof ctor$ ? this : new ctor$;
      this$.pinyin = pinyin != null ? pinyin : '';
      this$['zh-TW'] = arg$ != null ? arg$ : '';
      this$['zh-CN'] = arg1$ != null
        ? arg1$
        : this$['zh-TW'];
      return this$;
    } function ctor$(){} ctor$.prototype = prototype;
    prototype.flatten = function(){
      return this;
    };
    prototype.logAll = function(){};
    return Char;
  }());
  o = Node = (function(){
    Node.displayName = 'Node';
    var prototype = Node.prototype, constructor = Node;
    function Node(children, definition, short, wordClass){
      var this$ = this instanceof ctor$ ? this : new ctor$;
      this$.children = children != null
        ? children
        : [];
      this$.definition = definition != null ? definition : '';
      this$.short = short != null ? short : '';
      this$.wordClass = wordClass != null
        ? wordClass
        : [];
      return this$;
    } function ctor$(){} ctor$.prototype = prototype;
    prototype.flatten = function(){
      return flatten((function(){
        var i$, x$, ref$, len$, results$ = [];
        for (i$ = 0, len$ = (ref$ = this.children).length; i$ < len$; ++i$) {
          x$ = ref$[i$];
          results$.push(x$.flatten());
        }
        return results$;
      }.call(this)));
    };
    prototype.logAll = function(){
      var i$, ref$, len$, child, results$ = [];
      console.log(this.toString('zh-CN') + ", " + this.short);
      for (i$ = 0, len$ = (ref$ = this.children).length; i$ < len$; ++i$) {
        child = ref$[i$];
        results$.push(child.logAll());
      }
      return results$;
    };
    prototype.toString = function(mode){
      var ref$;
      switch (false) {
      case (ref$ = !mode) !== 'zh-TW' && ref$ !== 'zh-CN':
        return '';
      default:
        return this.flatten().map(function(it){
          return it[mode];
        }).join('');
      }
    };
    prototype.isLeaf = function(){
      return !this.children[0].isLeaf;
    };
    prototype.leafs = function(){
      switch (false) {
      case !this.isLeaf():
        return [this];
      default:
        return flatten((function(){
          var i$, x$, ref$, len$, results$ = [];
          for (i$ = 0, len$ = (ref$ = this.children).length; i$ < len$; ++i$) {
            x$ = ref$[i$];
            results$.push(x$.leafs());
          }
          return results$;
        }.call(this)));
      }
    };
    prototype.depth = function(){
      switch (false) {
      case !this.isLeaf():
        return 0;
      default:
        return 1 + max((function(){
          var i$, x$, ref$, len$, results$ = [];
          for (i$ = 0, len$ = (ref$ = this.children).length; i$ < len$; ++i$) {
            x$ = ref$[i$];
            results$.push(x$.depth());
          }
          return results$;
        }.call(this)));
      }
    };
    prototype.childrenOfDepth = function(depth){
      var child;
      switch (false) {
      case !this.isLeaf():
        return [this];
      case depth !== 0:
        return [this];
      default:
        return flatten((function(){
          var i$, ref$, len$, results$ = [];
          for (i$ = 0, len$ = (ref$ = this.children).length; i$ < len$; ++i$) {
            child = ref$[i$];
            results$.push(child.childrenOfDepth(depth - 1));
          }
          return results$;
        }.call(this)));
      }
    };
    return Node;
  }());
  punctuations = {
    '，': o([c('', '，')], 'comma'),
    '。': o([c('', '。')], 'full stop'),
    '？': o([c('', '？')], 'question mark'),
    '！': o([c('', '！')], 'exciamation mark'),
    '「': o([c('', '「')], 'quotation mark'),
    '」': o([c('', '」')], 'quotation mark'),
    '、': o([c('', '、')], 'enumeration comma'),
    '‧': o([c('', '‧')], 'middle dot'),
    '《': o([c('', '《')], 'title mark'),
    '》': o([c('', '》')], 'middle dot'),
    '…': o([c('', '…')], 'ellipsis'),
    '～': o([c('', '～')], 'wavy dash'),
    '　': o([c('', '　')], 'space')
  };
  Dict = (function(){
    Dict.displayName = 'Dict';
    var prototype = Dict.prototype, constructor = Dict;
    function Dict(path, done){
      var this$ = this instanceof ctor$ ? this : new ctor$;
      fs.readFile(path + "/dict.json", function(err, data){
        var moe, c, x$;
        moe = JSON.parse(data);
        for (c in moe) {
          x$ = moe[c];
          x$['zh-TW'] = tagless(moe[c]['zh-TW']);
          x$['zh-CN'] = tagless(moe[c]['zh-CN']);
          x$.pinyin = tagless(moe[c].pinyin);
          x$.en = x$.en.map(tagless);
        }
        this$.data = moe;
        return typeof done === 'function' ? done(this$) : void 8;
      });
      return this$;
    } function ctor$(){} ctor$.prototype = prototype;
    prototype.get = function(it){
      return this.data[it];
    };
    return Dict;
  }());
  Segmentations = (function(){
    Segmentations.displayName = 'Segmentations';
    var prototype = Segmentations.prototype, constructor = Segmentations;
    function Segmentations(node, path, done){
      var this$ = this instanceof ctor$ ? this : new ctor$;
      Dict(path, function(dict){
        var keys, values, idx, keywords, re, patch;
        keys = [];
        values = [];
        idx = 0;
        keywords = import$({}, punctuations);
        re = null;
        Data.traverse(node, function(node, parents){
          var ref$, ks, x$, s, str, lastIndex, r, i$, len$, char;
          if (!node.text && !((ref$ = node.attrs) != null && ref$.data)) {
            return;
          }
          if (parents[2] !== 'notes') {
            keys.push(node.text);
            return values.push(Node());
          } else if (node.attrs.data) {
            ks = slice.call(node.attrs.data);
            ks.sort(function(a, b){
              return b.simplified.length - a.simplified.length;
            });
            re = ks.map(function(it){
              var str, en, shortest, children;
              str = it.simplified;
              en = tagless(it.translation).split(/\//);
              shortest = slice.call(en).sort(function(a, b){
                return a.length - b.length;
              })[0];
              children = slice.call(str);
              keywords[it.simplified] = Node(children.map(function(it){
                var moe, en;
                moe = dict.get(it);
                if (children.length === 1) {
                  return Char(moe != null ? moe.pinyin : void 8, (moe != null ? moe['zh-TW'] : void 8) || it, moe != null ? moe['zh-CN'] : void 8);
                } else {
                  en = slice.call(moe.en);
                  return Node([Char(moe != null ? moe.pinyin : void 8, (moe != null ? moe['zh-TW'] : void 8) || it, moe != null ? moe['zh-CN'] : void 8)], en.join(', '), en.sort(function(a, b){
                    return a.length - b.length;
                  })[0]);
                }
              }), en.join(', '), shortest);
              return it.simplified;
            });
            return re = new RegExp(Object.keys(punctuations).concat(re).join('|'), 'g');
          } else {
            x$ = s = values[idx];
            x$.short = node.text;
            x$.definition = node.text;
            str = keys[idx] + "";
            lastIndex = 0;
            while (r = re.exec(str)) {
              if (lastIndex !== r.index) {
                for (i$ = 0, len$ = (ref$ = Array.prototype.slice.call(str.substring(lastIndex, r.index))).length; i$ < len$; ++i$) {
                  char = ref$[i$];
                  Array.prototype.push.apply(s.children, keywords[char]);
                }
              }
              lastIndex = re.lastIndex;
              s.children.push(keywords[r[0]]);
            }
            if (lastIndex !== str.length) {
              for (i$ = 0, len$ = (ref$ = Array.prototype.slice.call(str.substring(lastIndex))).length; i$ < len$; ++i$) {
                char = ref$[i$];
                Array.prototype.push.apply(s.children, keywords[char]);
              }
            }
            return ++idx;
          }
        });
        patch = function(node){
          var i$, ref$, len$, child;
          node.short = (function(){
            switch (node.short) {
            case 'few':
              return 'little';
            case 'pure':
              return 'white';
            case 'floriculture':
              return 'to plant a flower';
            case 'kind':
              return 'to plant';
            case '把[ba3]':
              return 'flower';
            case 'chance':
              return 'to meet';
            case 'youth':
              return 'green';
            case 'to hop':
              return 'to jump';
            case 'variant of 叫[jiao4]':
              return 'to call';
            case 'next':
              return 'to come';
            case '1':
              return 'one';
            case 'classifier for birds and certain animals, one of a pair, some utensils, vessels etc':
              return 'classifier for birds and certain animals';
            case 'variant of 鵝|鹅[e2]':
              return 'goose';
            case 'see 大夫[dai4 fu5]':
              return 'big';
            case 'Shuili township in Nantou county 南投縣|南投县[Nan2 tou2 xian4], central Taiwan':
              return 'in the water';
            case 'home':
              return 'inside';
            case 'to walk':
              return 'to swim';
            case 'to ask':
              return 'to invite';
            case 'rapidly':
              return 'classifier for livestock';
            case 'classifier for objects':
              return 'head, classifier for livestock';
            case 'very':
              return 'old';
            case 'raft':
              return 'to line up';
            case 'so':
              return 'well';
            case 'with':
              return 'together';
            case 'group':
              return 'to initiate (action)';
            case 'from':
              return 'go';
            case 'other':
              return 'he';
            case 'metropolis':
              return 'all';
            case 'variant of 是[shi4]':
              return 'is, are';
            case 'so':
              return 'good';
            default:
              return node.short;
            }
          }());
          if (node.children) {
            for (i$ = 0, len$ = (ref$ = node.children).length; i$ < len$; ++i$) {
              child = ref$[i$];
              patch(child);
            }
          }
        };
        values.map(patch);
        this$.data = zipObject(keys, values);
        return typeof done === 'function' ? done(this$) : void 8;
      });
      return this$;
    } function ctor$(){} ctor$.prototype = prototype;
    prototype.get = function(it){
      return this.data[it];
    };
    return Segmentations;
  }());
  Data = {
    Node: Node,
    Char: Char,
    punctuations: punctuations,
    getMasterPage: function(path, done){
      path = unslash(path);
      return fs.readFile(path + "/masterpage.json", function(err, data){
        return done(Data.patchMasterPage(JSON.parse(data), path));
      });
    },
    patchMasterPage: function(mp, path){
      var attrs, width, height, orientation, ratio;
      attrs = mp.attrs;
      width = parseInt(attrs['FO:PAGE-WIDTH'], 10);
      height = parseInt(attrs['FO:PAGE-HEIGHT'], 10);
      orientation = attrs['STYLE:PRINT-ORIENTATION'];
      ratio = orientation === 'landscape'
        ? width / height
        : height / width;
      mp.setup = {
        path: path,
        ratio: ratio,
        x: 0,
        y: 0,
        width: width,
        height: height,
        totalPages: attrs['TOTAL-PAGES']
      };
      return import$(mp, masterPage);
    },
    getPresentation: function(masterPage, done){
      var setup, path, pages, counter, gotOne, i$, to$, results$ = [];
      setup = masterPage.setup;
      path = unslash(setup.path);
      pages = [];
      counter = 0;
      gotOne = function(data, i){
        pages[i] = data;
        counter += 1;
        if (counter === setup.totalPages) {
          return done({
            name: 'presentation',
            namespace: 'office',
            attrs: {
              x: '0',
              y: '0',
              width: '28cm',
              height: '21cm'
            },
            children: pages
          });
        }
      };
      for (i$ = 1, to$ = setup.totalPages; i$ <= to$; ++i$) {
        results$.push((fn$.call(this, i$)));
      }
      return results$;
      function fn$(i){
        return fs.readFile(path + "/page" + i + ".json", function(err, data){
          return gotOne(Data.patchPageJSON(JSON.parse(data), path), i - 1);
        });
      }
    },
    patchPageJSON: function(data, path){
      var propNames;
      path == null && (path = '');
      propNames = ['name', 'x', 'y', 'width', 'height', 'href', 'data', 'onClick', 'onTouchStart'];
      data.children = data.children.concat(masterPage.children);
      return Data.transform(data, function(attrs, nodeName, parents){
        var newAttrs, k, v, name, x$;
        attrs == null && (attrs = {});
        newAttrs = {
          style: {}
        };
        for (k in attrs) {
          v = attrs[k];
          name = camelFromHyphenated(splitNamespace(k).name);
          switch (false) {
          case name !== 'pageWidth':
            newAttrs.width = v;
            break;
          case name !== 'pageHeight':
            newAttrs.height = v;
            break;
          case !in$(name, propNames):
            newAttrs[name] = v;
            break;
          default:
            newAttrs.style[name] = v;
          }
        }
        x$ = newAttrs;
        if (newAttrs.href) {
          x$.href = path + "/" + newAttrs.href;
        }
        return x$;
      });
    },
    transform: function(node, onNode, parents){
      var child;
      onNode == null && (onNode = null);
      parents == null && (parents = []);
      return import$(splitNamespace(node.name), {
        text: node.text,
        attrs: typeof onNode === 'function' ? onNode(node.attrs, node.name, parents) : void 8,
        children: !node.children
          ? []
          : (function(){
            var i$, ref$, len$, results$ = [];
            for (i$ = 0, len$ = (ref$ = node.children).length; i$ < len$; ++i$) {
              child = ref$[i$];
              results$.push(Data.transform(child, onNode, parents.concat([node.name])));
            }
            return results$;
          }())
      });
    },
    traverse: function(node, onNode, parents){
      var i$, ref$, len$, child, results$ = [];
      parents == null && (parents = []);
      if (!onNode) {
        return;
      }
      onNode(node, parents);
      if (!node.children) {
        return;
      }
      for (i$ = 0, len$ = (ref$ = node.children).length; i$ < len$; ++i$) {
        child = ref$[i$];
        results$.push(Data.traverse(child, onNode, parents.concat([node.name])));
      }
      return results$;
    },
    segment: function(str, segs, longest){
      var re, words, lastIndex, r;
      segs == null && (segs = []);
      longest == null && (longest = true);
      switch (false) {
      case !!(str != null && str.length):
        return null;
      case segs.length !== 0:
        return [str.slice()];
      default:
        segs.sort(longest
          ? function(a, b){
            return b.length - a.length;
          }
          : function(a, b){
            return a.length - b.length;
          });
        segs = segs.filter((function(it){
          return it !== str;
        }));
        re = Object.keys(punctuations).concat(segs).join('|') + "";
        re = new RegExp(re, 'g');
        words = [];
        lastIndex = 0;
        while (r = re.exec(str)) {
          if (lastIndex !== r.index) {
            Array.prototype.push.apply(words, Array.prototype.slice.call(str.substring(lastIndex, r.index)));
          }
          lastIndex = re.lastIndex;
          words.push(r[0]);
        }
        if (lastIndex !== str.length) {
          Array.prototype.push.apply(words, Array.prototype.slice.call(str.substring(lastIndex)));
        }
        return words;
      }
    },
    Segmentations: Segmentations
  };
  module.exports = Data;
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
}).call(this);
