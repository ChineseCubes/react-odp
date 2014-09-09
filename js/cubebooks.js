(function(){
  var isArray, isString, flatten, max, min, map, zipObject, slice, shadow, masterPage, c, Char, o, Node, punctuations, utils, ref$, isNaN, a, div, i, nav, span, AudioControl, Character, Word, ActionMenu, SettingsButton, Stroker, Sentence;
  isArray = _.isArray, isString = _.isString, flatten = _.flatten, max = _.max, min = _.min, map = _.map, zipObject = _.zipObject;
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
  punctuations = {
    '，': o('', [''], 'comma', [c('', '，')]),
    '。': o('', [''], 'full stop', [c('', '。')]),
    '？': o('', [''], 'question mark', [c('', '？')])
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
    getPresentation: function(path, pageTotal, done){
      var pages, counter, gotOne, i$, results$ = [];
      pages = [];
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
    askMoeDict: function(ch, done){
      return $.getJSON("www.moedict.tw/~" + ch + ".json", function(moe){
        var tagless;
        tagless = utils.strip;
        return done({
          zh_TW: tagless(moe.title),
          zh_CN: tagless(moe.heteronyms[0].alt || moe.title),
          pinyin: tagless(moe.heteronyms[0].pinyin),
          English: tagless(moe.translation.English).split(/,\w*?/)
        });
      });
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
    buildSyntaxTreeFromNotes: function(node){
      var keys, values, keywords, idx;
      keys = [];
      values = [];
      keywords = [];
      idx = 0;
      utils.traverse(node, function(node, parents){
        var current, i, x$;
        if (!node.text) {
          return;
        }
        if (parents[2] !== 'notes') {
          current = keywords[keywords.length - 1];
          if (!current || 0 !== Object.keys(current).length) {
            keywords.push({});
          } else {
            keywords.push(current);
          }
          keys.push(node.text);
          return values.push(Node('', [], '', (function(){
            var i$, to$, results$ = [];
            for (i$ = 0, to$ = node.text.length; i$ < to$; ++i$) {
              i = i$;
              results$.push(Node('', [], '', [Char('', node.text[i])]));
            }
            return results$;
          }())));
        } else {
          x$ = values[idx];
          x$.en = node.text;
          x$.definition = node.text;
          console.log(node.text, values[idx]);
          return ++idx;
        }
      });
      if (keys.length !== idx) {
        console.warn('the translations of sentences are not match');
        console.log(keys, values);
      }
      return utils.data = zipObject(keys, values);
    }
  };
  import$((ref$ = this.Data) != null
    ? ref$
    : this.Data = {}, utils);
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
      }, this.props.meaning ? data.en : ''));
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
      if (this.props.data.en !== props.data.en) {
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
