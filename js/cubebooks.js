(function(){
  var require, ref$, isArray, isString, flatten, max, min, map, zipObject, slice, shadow, masterPage, c, Char, o, Node, punctuations, Dict, Segmentations, utils, isNaN, a, div, i, nav, span, AudioControl, Character, Word, ActionMenu, SettingsButton, Stroker, Sentence;
  require == null && (require = (function(packages){
    return function(it){
      return packages[it];
    };
  }.call(this, {
    lodash: _
  })));
  ref$ = require('lodash'), isArray = ref$.isArray, isString = ref$.isString, flatten = ref$.flatten, max = ref$.max, min = ref$.min, map = ref$.map, zipObject = ref$.zipObject;
  slice = Array.prototype.slice;
  shadow = '0 0 5px 5px rgba(0,0,0,0.1);';
  masterPage = {
    children: [
      {
        name: 'draw:frame',
        attrs: {
          background: '#fff',
          opacity: '0.75',
          '-webkit-box-shadow': shadow,
          '-moz-box-shadow': shadow,
          'box-shadow': shadow,
          width: '28cm',
          height: '2cm'
        }
      }, {
        name: 'draw:frame',
        attrs: {
          'style-name': 'Mgr3',
          'text-style-name': 'MP4',
          x: '0.34cm',
          y: '0.38cm',
          width: '1.41cm',
          height: '1.198cm'
        },
        children: [{
          name: 'draw:image',
          attrs: {
            href: '../images/home.png',
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
          x: '26.16cm',
          y: '0.35cm',
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
      var tagless, this$ = this instanceof ctor$ ? this : new ctor$;
      tagless = utils.strip;
      $.getJSON(path + "/dict.json", function(moe){
        var c, ref$;
        for (c in moe) {
          (ref$ = moe[c]).en = ref$.en.map(tagless);
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
        var tagless, keys, values, idx, keywords, re;
        tagless = utils.strip;
        keys = [];
        values = [];
        idx = 0;
        keywords = import$({}, punctuations);
        re = null;
        utils.traverse(node, function(node, parents){
          var ref$, ks, x$, s, str, r;
          if (!node.text && !((ref$ = node.attrs) != null && ref$.data)) {
            return;
          }
          if (parents[2] !== 'notes') {
            keys.push(node.text);
            return values.push(Node());
          } else if (node.attrs.data) {
            ks = slice.call(node.attrs.data);
            ks.sort(function(a, b){
              return b.traditional.length - a.traditional.length;
            });
            re = ks.map(function(it){
              var str, en, shortest, children;
              str = it.traditional;
              en = tagless(it.translation).split(/\//);
              shortest = slice.call(en).sort(function(a, b){
                return a.length - b.length;
              })[0];
              children = slice.call(str);
              keywords[it.traditional] = Node(children.map(function(it){
                var moe, en;
                moe = dict.get(it);
                if (children.length === 1) {
                  return Char(moe != null ? moe.pinyin : void 8, (moe != null ? moe.zh_TW : void 8) || it, moe != null ? moe.zh_CN : void 8);
                } else {
                  en = slice.call(moe.en);
                  return Node([Char(moe != null ? moe.pinyin : void 8, (moe != null ? moe.zh_TW : void 8) || it, moe != null ? moe.zh_CN : void 8)], en.join(', '), en.sort(function(a, b){
                    return a.length - b.length;
                  })[0]);
                }
              }), en.join(', '), shortest);
              return it.traditional;
            });
            return re = new RegExp(Object.keys(punctuations).concat(re).join('|'));
          } else {
            x$ = s = values[idx];
            x$.short = node.text;
            x$.definition = node.text;
            str = keys[idx] + "";
            while (r = re.exec(str)) {
              s.children.push(keywords[r[0]]);
              str = str.replace(r[0], '');
            }
            return ++idx;
          }
        });
        if (keys.length !== idx) {
          console.warn('the translations of sentences are not match');
          console.log(keys, values);
        }
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
  utils = {
    splitNamespace: function(it){
      var r;
      r = it.toLowerCase().split(':').reverse();
      return {
        namespace: r[1],
        name: r[0]
      };
    },
    unslash: function(it){
      return it.replace(/\/$/, '') + "";
    },
    camelFromHyphenated: function(it){
      return it.split('-').map(function(v, i){
        switch (false) {
        case i !== 0:
          return v;
        default:
          return v.slice(0, 1).toUpperCase() + "" + v.slice(1);
        }
      }).join('');
    },
    getMasterPage: function(path, done){
      path = utils.unslash(path);
      return $.getJSON(path + "/masterpage.json", function(it){
        return done(utils.patchMasterPage(it, path));
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
      path = utils.unslash(setup.path);
      pages = [];
      counter = 0;
      gotOne = function(data, i){
        data.attrs.y = i * 21.5 + "cm";
        pages.push(data);
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
        return $.getJSON(path + "/page" + i + ".json", function(data){
          return gotOne(utils.patchPageJSON(data, path), i - 1);
        });
      }
    },
    patchPageJSON: function(data, path){
      var propNames;
      path == null && (path = '');
      propNames = ['name', 'x', 'y', 'width', 'height', 'href', 'data', 'onClick'];
      data.children = data.children.concat(masterPage.children);
      return utils.transform(data, function(attrs, nodeName, parents){
        var newAttrs, k, v, name, x$;
        attrs == null && (attrs = {});
        newAttrs = {
          style: {}
        };
        for (k in attrs) {
          v = attrs[k];
          name = utils.camelFromHyphenated(utils.splitNamespace(k).name);
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
        results$.push(utils.traverse(child, onNode, parents.concat([node.name])));
      }
      return results$;
    },
    strip: function(it){
      var tmp, dom;
      tmp = document.createElement('span');
      tmp.innerHTML = (function(){
        switch (false) {
        case document.contentType !== 'application/xhtml+xml':
          return new XMLSerializer().serializeToString(new DOMParser().parseFromString(it, 'text/html').body).replace(/^<body[^>]*>/, '').replace(/<\/body>$/, '');
        case !document.xmlVersion:
          dom = document.implementation.createHTMLDocument('');
          dom.body.innerHTML = it;
          return new XMLSerializer().serializeToString(dom.body).replace(/^<body[^>]*>/, '').replace(/<\/body>$/, '');
        default:
          return it;
        }
      }());
      return tmp.textContent || tmp.innerText || '';
    },
    Segmentations: Segmentations
  };
  import$((ref$ = this.Data) != null
    ? ref$
    : this.Data = {}, utils);
  if (typeof module != 'undefined' && module !== null) {
    module.exports = this.Data;
  }
  isNaN = _.isNaN;
  ref$ = React.DOM, a = ref$.a, div = ref$.div, i = ref$.i, nav = ref$.nav, span = ref$.span;
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
        mode: 'zh_TW',
        pinyin: false
      };
    },
    render: function(){
      var data;
      data = this.props.data;
      return div({
        className: 'comp character'
      }, div({
        className: 'pronounciation'
      }, this.props.pinyin ? data.pinyin : ''), this.props.mode === 'zh_TW'
        ? div({
          className: 'char zh_TW'
        }, data.zh_TW)
        : div({
          className: 'char zh_CN'
        }, data.zh_CN));
    }
  });
  Word = React.createClass({
    displayName: 'CUBE.Word',
    getDefaultProps: function(){
      return {
        data: null,
        mode: 'zh_TW',
        pinyin: false,
        meaning: false
      };
    },
    getInitialState: function(){
      return {
        menu: false
      };
    },
    render: function(){
      var data, cs, this$ = this;
      data = this.props.data;
      cs = data.flatten();
      return div({
        className: 'comp word'
      }, this.state.menu ? ActionMenu({
        onClick: function(it){
          return this$.props.onMenuClick(it);
        }
      }) : void 8, div({
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
            mode: this.props.mode,
            pinyin: this.props.pinyin
          });
        }
      }.call(this))), div({
        className: 'meaning'
      }, this.props.meaning ? data.short : ''));
    }
  });
  ActionMenu = React.createClass({
    displayName: 'CUBE.ActionMenu',
    render: function(){
      return div({
        className: 'actions'
      }, div({
        className: 'menu single'
      }, div({
        className: 'ui buttons'
      }, this.transferPropsTo(div({
        className: 'ui icon button black write'
      }, i({
        className: 'icon pencil'
      }))))));
    }
  });
  SettingsButton = React.createClass({
    displayName: 'CUBE.SettingsButton',
    render: function(){
      return this.transferPropsTo(i({
        className: 'settings icon'
      }));
    }
  });
  Stroker = React.createClass({
    displayName: 'ZhStrokeData.SpriteStroker',
    getDefaultProps: function(){
      return {
        path: '../../strokes/',
        words: '萌'
      };
    },
    reset: function(props){
      var $container;
      props.words = props.words.replace(/，|。|？|『|』|「|」|：/g, function(){
        return '';
      });
      this.stroker = new zhStrokeData.SpriteStroker(props.words, props.path);
      console.log(this.stroker);
      $container = $(this.refs.container.getDOMNode());
      return $container.empty().append(this.stroker.domElemennt);
    },
    play: function(){
      return this.stroker.play();
    },
    pause: function(it){
      return this.stroker.pause(it);
    },
    componentDidMount: function(){
      return this.reset(this.props);
    },
    componentWillReceiveProps: this.reset,
    render: function(){
      return div({
        ref: 'container',
        className: 'strokes'
      });
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
        mode: 'zh_TW',
        pinyin: false,
        meaning: false
      };
    },
    getInitialState: function(){
      return {
        pinyin: this.props.pinyin,
        meaning: this.props.meaning,
        focus: null,
        depth: 0
      };
    },
    componentWillReceiveProps: function(props){
      var ref$;
      if (this.props.data.short !== props.data.short) {
        this.setState({
          focus: (ref$ = this.getInitialState()).focus,
          depth: ref$.depth
        });
        return $(this.refs.settings.getDOMNode()).height(0);
      }
    },
    renderDepthButton: function(name){
      var actived, this$ = this;
      actived = this.state.depth === this.DEPTH[name];
      return a({
        className: "item " + name + " " + (actived ? 'active' : ''),
        onClick: function(){
          this$.focus(null);
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
    focus: function(it){
      var ref$, comp;
      if ((ref$ = this.state.focus) != null) {
        ref$.setState({
          menu: false
        });
      }
      comp = it === this.state.focus ? null : it;
      if (comp != null) {
        comp.setState({
          menu: true
        });
      }
      return this.setState({
        focus: comp
      });
    },
    toggleSettings: function(){
      var $settings;
      $settings = $(this.refs.settings.getDOMNode());
      return $settings.animate({
        height: $settings.height() !== 0 ? 0 : 48
      });
    },
    render: function(){
      var data, focus, c, this$ = this;
      data = this.props.data;
      return div({
        className: 'playground'
      }, div({
        className: 'comp sentence'
      }, div({
        className: 'aligner'
      }), (function(){
        var i$, results$ = [];
        for (i$ in data.childrenOfDepth(this.state.depth)) {
          results$.push((fn$.call(this, i$, data.childrenOfDepth(this.state.depth)[i$])));
        }
        return results$;
        function fn$(i, word){
          var this$ = this;
          return Word({
            key: i,
            ref: i,
            data: word,
            mode: this.props.mode,
            pinyin: this.state.pinyin,
            meaning: this.state.meaning,
            onClick: function(){
              return this$.focus(this$.refs[i]);
            },
            onMenuClick: function(){
              return this$.refs.stroker.play();
            }
          });
        }
      }.call(this)), Stroker({
        ref: 'stroker'
      })), nav({
        ref: 'settings',
        className: 'navbar',
        style: {
          height: 0
        }
      }, div({
        className: 'ui borderless menu'
      }, div({
        className: 'left menu'
      }, a({
        className: "item toggle chinese " + (this.state.pinyin ? 'active' : ''),
        onClick: function(){
          return this$.setState({
            pinyin: !this$.state.pinyin
          });
        }
      }, 'Pinyin'), a({
        className: "item toggle chinese " + (this.state.meaning ? 'active' : ''),
        onClick: function(){
          return this$.setState({
            meaning: !this$.state.meaning
          });
        }
      }, 'English')), div({
        className: 'right menu'
      }, this.renderDepthButton('sentence'), this.renderDepthButton('words'), this.renderDepthButton('characters'), a({
        className: 'item toggle chinese',
        onClick: this.toggleMode
      }, this.props.mode === 'zh_TW' ? 'T' : 'S')))), div({
        className: 'entry'
      }, this.state.focus ? (focus = this.state.focus.props.data, [
        span({
          className: 'ui black label'
        }, (function(){
          var i$, ref$, len$, results$ = [];
          for (i$ = 0, len$ = (ref$ = focus.flatten()).length; i$ < len$; ++i$) {
            c = ref$[i$];
            results$.push(c[this.props.mode]);
          }
          return results$;
        }.call(this)).join('')), span({
          className: 'definition'
        }, focus.definition)
      ]) : void 8));
    }
  });
  import$((ref$ = this.CUBEBooks) != null
    ? ref$
    : this.CUBEBooks = {}, {
    AudioControl: AudioControl,
    SettingsButton: SettingsButton,
    Character: Character,
    Word: Word,
    Sentence: Sentence
  });
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
