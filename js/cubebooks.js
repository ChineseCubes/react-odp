(function(){
  var isArray, isString, cloneDeep, flatten, slice, masterPage, c, Character, o, Node, getSegmentations, utils, ref$, div, AudioControl, Word;
  isArray = _.isArray, isString = _.isString, cloneDeep = _.cloneDeep, flatten = _.flatten;
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
  c = Character = (function(){
    Character.displayName = 'Character';
    var prototype = Character.prototype, constructor = Character;
    function Character(pinyin, zh_TW, zh_CN){
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
    return Character;
  }());
  o = Node = (function(){
    Node.displayName = 'Node';
    var prototype = Node.prototype, constructor = Node;
    function Node(en, wordClass, definition, children){
      var this$ = this instanceof ctor$ ? this : new ctor$;
      this$.en = en != null ? en : '';
      this$.wordClass = wordClass != null ? wordClass : '';
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
    return Node;
  }());
  getSegmentations = function(text, done){
    var data;
    data = {
      '洗手台': o('Washbasin', ['noun'], 'A large bowl or basin used for washing one\'s hands and face.', [o('Wash', ['verb'], 'clean with water', [c('xǐ', '洗')]), o('Hand', ['noun'], 'The end part of a person’s arm beyond the wrist, including the palm, fingers, and thumb.', [c('shǒu', '手')]), o('Basin', ['noun'], 'A wide open container used for preparing food or for holding liquid.', [c('tái', '台')])])
    };
    return done(data[text] || o());
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
    getSegmentations: getSegmentations
  };
  import$((ref$ = this.Data) != null
    ? ref$
    : this.Data = {}, utils);
  div = React.DOM.div;
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
        data: null
      };
    },
    render: function(){
      var data;
      data = this.props.data;
      return div({
        className: 'character'
      }, div({
        className: 'zh_TW',
        zh_TW: data.zh_TW
      }), div({
        className: 'zh_CN',
        zh_TW: data.zh_TW
      }), div({
        className: 'pronounciation',
        pinyin: data.pinyin
      }));
    }
  });
  Word = React.createClass({
    displayName: 'CUBE.Word',
    getDefaultProps: function(){
      return {
        data: null
      };
    },
    render: function(){
      var data, wc;
      data = this.props.data;
      return div({
        className: 'word'
      }, div({
        className: 'meaning',
        en: data.en
      }), div({
        className: 'characters'
      }, (function(){
        var i$, results$ = [];
        for (i$ in data.flatten()) {
          results$.push((fn$.call(this, i$, data.flatten()[i$])));
        }
        return results$;
        function fn$(i, c){
          return Character({
            key: i,
            data: c
          });
        }
      }.call(this))), div({
        className: 'entry'
      }, div({
        className: 'word-class'
      }, (function(){
        var i$, ref$, len$, results$ = [];
        for (i$ = 0, len$ = (ref$ = data.wordClass).length; i$ < len$; ++i$) {
          wc = ref$[i$];
          results$.push(div(null, wc));
        }
        return results$;
      }())), div({
        className: 'definition',
        definition: data.definition
      })));
    }
  });
  import$((ref$ = this.CUBEBooks) != null
    ? ref$
    : this.CUBEBooks = {}, {
    AudioControl: AudioControl,
    Character: Character,
    Word: Word
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
