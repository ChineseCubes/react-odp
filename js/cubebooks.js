(function(){
  var isArray, isString, cloneDeep, flatten, max, zipObject, slice, masterPage, c, Char, o, Node, utils, ref$, a, div, nav, span, AudioControl, Character, Word, Sentence;
  isArray = _.isArray, isString = _.isString, cloneDeep = _.cloneDeep, flatten = _.flatten, max = _.max, zipObject = _.zipObject;
  slice = Array.prototype.slice;
  masterPage = {
    children: [
      {
        name: 'draw:frame',
        attrs: {
          'style-name': 'Mgr3',
          'text-style-name': 'MP4',
          x: '0.19cm',
          y: '0.22cm',
          width: '1.41cm',
          height: '1.198cm'
        },
        children: [{
          name: 'draw:image',
          attrs: {
            href: 'Pictures/100002010000002800000022F506C368.png',
            'on-click': function(){
              return alert('home');
            }
          }
        }]
      }, {
        name: 'draw:frame',
        attrs: {
          'style-name': 'Mgr4',
          'text-style-name': 'MP4',
          x: '26.4cm',
          y: '0.4cm',
          width: '1.198cm',
          height: '1.198cm'
        },
        children: [{
          name: 'draw:image',
          attrs: {
            name: 'activity',
            href: 'Pictures/1000020100000022000000223520C9AB.png',
            'on-click': function(){
              throw Error('unimplemented');
            }
          }
        }]
      }
    ]
  };
  c = Char = (function(){
    Char.displayName = 'Char';
    var prototype = Char.prototype, constructor = Char;
    function Char(pinyin, zh_TW, zh_CN){
      var this$ = this instanceof ctor$ ? this : new ctor$;
      this$.pinyin = pinyin;
      this$.zh_TW = zh_TW;
      this$.zh_CN = zh_CN != null
        ? zh_CN
        : this$.zh_TW;
      return this$;
    } function ctor$(){} ctor$.prototype = prototype;
    prototype.flatten = function(){
      return this;
    };
    return Char;
  }());
  o = Node = (function(){
    Node.displayName = 'Node';
    var prototype = Node.prototype, constructor = Node;
    function Node(en, wordClass, definition, children){
      var this$ = this instanceof ctor$ ? this : new ctor$;
      this$.en = en != null ? en : '';
      this$.wordClass = wordClass != null
        ? wordClass
        : [];
      this$.definition = definition != null ? definition : '';
      this$.children = children != null
        ? children
        : [];
      return this$;
    } function ctor$(){} ctor$.prototype = prototype;
    prototype.flatten = function(){
      var child;
      return flatten((function(){
        var i$, ref$, len$, results$ = [];
        for (i$ = 0, len$ = (ref$ = this.children).length; i$ < len$; ++i$) {
          child = ref$[i$];
          results$.push(child.flatten());
        }
        return results$;
      }.call(this)));
    };
    prototype.isLeaf = function(){
      return !this.children[0].leafs;
    };
    prototype.leafs = function(){
      var child;
      switch (false) {
      case !this.isLeaf():
        return [this];
      default:
        return flatten((function(){
          var i$, ref$, len$, results$ = [];
          for (i$ = 0, len$ = (ref$ = this.children).length; i$ < len$; ++i$) {
            child = ref$[i$];
            results$.push(child.leafs());
          }
          return results$;
        }.call(this)));
      }
    };
    prototype.depth = function(){
      var child;
      switch (false) {
      case !this.isLeaf():
        return 0;
      default:
        return 1 + max((function(){
          var i$, ref$, len$, results$ = [];
          for (i$ = 0, len$ = (ref$ = this.children).length; i$ < len$; ++i$) {
            child = ref$[i$];
            results$.push(child.depth());
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
      var pages, pageTotal, counter, gotOne, i$, results$ = [];
      pages = [];
      pageTotal = 8;
      counter = 0;
      gotOne = function(data, i){
        data.attrs.y = i * 21.5 + "cm";
        pages.push(data);
        counter += 1;
        if (counter === pageTotal) {
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
      for (i$ = 1; i$ <= pageTotal; ++i$) {
        results$.push((fn$.call(this, i$)));
      }
      return results$;
      function fn$(i){
        return utils.getPageJSON(path + "/page" + i + ".json", function(it){
          return gotOne(it, i - 1);
        });
      }
    },
    getPageJSON: function(path, done){
      var propNames;
      propNames = ['name', 'x', 'y', 'width', 'height', 'href', 'onClick'];
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
            name = ODP.camelFromHyphenated(utils.splitNamespace(k).name);
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
    },
    traverse: function(node, onNode, parents){
      var i$, ref$, len$, child, results$ = [];
      onNode == null && (onNode = null);
      parents == null && (parents = []);
      onNode(node, parents);
      for (i$ = 0, len$ = (ref$ = node.children).length; i$ < len$; ++i$) {
        child = ref$[i$];
        results$.push(utils.traverse(child, onNode, parents.concat([node.name])));
      }
      return results$;
    },
    getSegmentations: function(text, done){
      return done(utils.data[text] || Node());
    },
    strip: function(it){
      var tmp;
      tmp = document.createElement('span');
      tmp.innerHTML = it;
      return tmp.textContent || tmp.innerText || '';
    },
    buildSyntaxTreeFromNotes: function(node){
      var keys, values, zh, en, current;
      keys = [];
      values = [];
      zh = null;
      en = null;
      current = 0;
      utils.traverse(node, function(node, parents){
        var ss, char;
        if (!node.text) {
          return;
        }
        if (parents[2] !== 'notes') {
          return keys.push(node.text);
        } else {
          if (keys.length > values.length) {
            return values.push(Node(node.text, [], node.text));
          } else {
            if (current >= values.length) {
              return;
            }
            if (!zh) {
              ss = node.text.split(' ');
              if (ss.length !== 1) {
                zh = ss[0];
                en = ss[1];
              } else {
                zh = node.text;
              }
            } else if (!en) {
              en = node.text;
            }
            if (zh && en) {
              if (!new RegExp(zh).test(keys[current])) {
                ++current;
              }
              char = Char();
              values[current].children.push(Node(en, [], en, zh.length === 1
                ? (char = Char(), $.get("https://www.moedict.tw/~" + zh + ".json", function(moe){
                  var x$;
                  x$ = char;
                  x$.zh_TW = utils.strip(moe.title);
                  x$.zh_CN = utils.strip(moe.heteronyms[0].alt || char.zh_TW);
                  x$.pinyin = utils.strip(moe.heteronyms[0].pinyin);
                  return x$;
                }), [char])
                : (function(){
                  var i$, len$, results$ = [];
                  for (i$ = 0, len$ = zh.length; i$ < len$; ++i$) {
                    results$.push((fn$.call(this, zh[i$])));
                  }
                  return results$;
                  function fn$(c){
                    var char, n;
                    char = Char();
                    n = Node('', [], '', [char]);
                    $.get("https://www.moedict.tw/~" + c + ".json", function(moe){
                      var x$;
                      x$ = char;
                      x$.zh_TW = utils.strip(moe.title);
                      x$.zh_CN = utils.strip(moe.heteronyms[0].alt || char.zh_TW);
                      x$.pinyin = utils.strip(moe.heteronyms[0].pinyin);
                      return n.definition = utils.strip(moe.translation.English);
                    });
                    return n;
                  }
                }.call(this))));
              zh = null;
              return en = null;
            }
          }
        }
      });
      return utils.data = zipObject(keys, values);
    }
  };
  import$((ref$ = this.Data) != null
    ? ref$
    : this.Data = {}, utils);
  ref$ = React.DOM, a = ref$.a, div = ref$.div, nav = ref$.nav, span = ref$.span;
  AudioControl = React.createClass({
    displayName: 'CUBEBooks.AudioControl',
    getDefaultProps: function(){
      return {
        element: null
      };
    },
    getInitialState: function(){
      return {
        playing: false
      };
    },
    componentWillMount: function(){
      var x$;
      x$ = this.props.element;
      x$.pause();
      x$.addEventListener("play", this.onChange);
      x$.addEventListener("pause", this.onChange);
      x$.addEventListener("ended", this.onChange);
      return x$;
    },
    componentWillUnmount: function(){
      var x$;
      x$ = this.props.element;
      x$.removeEventListener("play", this.onChange);
      x$.removeEventListener("pause", this.onChange);
      x$.removeEventListener("ended", this.onChange);
      return x$;
    },
    time: function(){
      var ref$;
      return ((ref$ = this.props.element) != null ? ref$.currentTime : void 8) || 0;
    },
    toggle: function(){
      var e;
      e = this.props.element;
      if (e.paused) {
        return e.play();
      } else {
        return e.pause();
      }
    },
    onChange: function(){
      return this.setState({
        playing: !this.props.element.paused
      });
    },
    render: function(){
      return div({
        className: "audio-control" + (this.state.playing ? ' playing' : ''),
        style: {
          width: '100%',
          height: '100%'
        },
        onClick: this.toggle
      });
    }
  });
  Character = React.createClass({
    displayName: 'CUBE.Character',
    getDefaultProps: function(){
      return {
        data: null,
        mode: 'zh_TW'
      };
    },
    render: function(){
      var data;
      data = this.props.data;
      return div({
        className: 'character'
      }, this.props.mode === 'zh_TW'
        ? div({
          className: 'zh_TW'
        }, data.zh_TW)
        : div({
          className: 'zh_CN'
        }, data.zh_CN), div({
        className: 'pronounciation'
      }, data.pinyin));
    }
  });
  Word = React.createClass({
    displayName: 'CUBE.Word',
    getDefaultProps: function(){
      return {
        data: null,
        mode: 'zh_TW'
      };
    },
    render: function(){
      var data, cs;
      data = this.props.data;
      cs = data.flatten();
      return div({
        className: 'word'
      }, div({
        className: 'characters',
        onClick: this.props.onClick
      }, (function(){
        var i$, results$ = [];
        for (i$ in cs) {
          results$.push((fn$.call(this, i$, cs[i$])));
        }
        return results$;
        function fn$(i, c){
          return Character({
            key: i,
            data: c,
            mode: this.props.mode
          });
        }
      }.call(this)), div({
        className: 'meaning'
      }, data.en)));
    }
  });
  Sentence = React.createClass({
    DEPTH: {
      sentence: 0,
      words: 1,
      characters: Infinity
    },
    displayName: 'CUBE.Sentence',
    getDefaultProps: function(){
      return {
        data: null,
        mode: 'zh_TW'
      };
    },
    getInitialState: function(){
      return {
        focus: null,
        depth: 0
      };
    },
    componentWillReceiveProps: function(props){
      if (this.props.data.en !== props.data.en) {
        return this.setState(this.getInitialState());
      }
    },
    renderDepthButton: function(name){
      var actived, this$ = this;
      actived = this.state.depth === this.DEPTH[name];
      return a({
        className: "item " + name + " " + (actived ? 'active' : ''),
        onClick: function(){
          return this$.setState({
            depth: this$.DEPTH[name]
          });
        }
      }, name);
    },
    toggleMode: function(){
      return this.setProps({
        mode: this.props.mode === 'zh_TW' ? 'zh_CN' : 'zh_TW'
      });
    },
    toggleDefinition: function(it){
      return this.setState({
        focus: it === this.state.focus ? null : it
      });
    },
    render: function(){
      var data, focus, c;
      data = this.props.data;
      return div(null, nav({
        className: 'navbar'
      }, div({
        className: 'ui borderless menu'
      }, div({
        className: 'right menu'
      }, this.renderDepthButton('sentence'), this.renderDepthButton('words'), this.renderDepthButton('characters'), a({
        className: 'item toggle chinese',
        onClick: this.toggleMode
      }, this.props.mode === 'zh_TW' ? 'T' : 'S')))), (function(){
        var i$, results$ = [];
        for (i$ in data.childrenOfDepth(this.state.depth)) {
          results$.push((fn$.call(this, i$, data.childrenOfDepth(this.state.depth)[i$])));
        }
        return results$;
        function fn$(i, word){
          var this$ = this;
          return Word({
            key: i,
            data: word,
            mode: this.props.mode,
            onClick: function(){
              return this$.toggleDefinition(word);
            }
          });
        }
      }.call(this)), this.state.focus ? (focus = this.state.focus, div({
        className: 'entry'
      }, span({
        className: 'ui black small label'
      }, (function(){
        var i$, ref$, len$, results$ = [];
        for (i$ = 0, len$ = (ref$ = focus.flatten()).length; i$ < len$; ++i$) {
          c = ref$[i$];
          results$.push(c[this.props.mode]);
        }
        return results$;
      }.call(this)).join('')), span({
        className: 'definition'
      }, focus.definition))) : void 8);
    }
  });
  import$((ref$ = this.CUBEBooks) != null
    ? ref$
    : this.CUBEBooks = {}, {
    AudioControl: AudioControl,
    Character: Character,
    Word: Word,
    Sentence: Sentence
  });
  function in$(x, xs){
    var i = -1, l = xs.length >>> 0;
    while (++i < l) if (x === xs[i]) return true;
    return false;
  }
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
