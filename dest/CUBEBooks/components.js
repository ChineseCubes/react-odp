(function(){
  var isNaN, $, React, Data, zhStrokeData, ref$, a, div, i, img, nav, span, onClick, sayIt, AudioControl, Character, UndoCut, Howler, Howl, API, Word, ActionMenu, SettingsButton, Stroker, Sentence, split$ = ''.split;
  isNaN = require('lodash').isNaN;
  $ = require('jquery');
  React = require('react');
  Data = require('./data');
  zhStrokeData = (function(){
    try {
      return require('zhStrokeData');
    } catch (e$) {}
  }());
  ref$ = React.DOM, a = ref$.a, div = ref$.div, i = ref$.i, img = ref$.img, nav = ref$.nav, span = ref$.span;
  onClick = (function(){
    try {
      return 'ontouchstart' in window;
    } catch (e$) {}
  }()) ? 'onTouchStart' : 'onClick';
  sayIt = function(text, lang){
    lang == null && (lang = 'en-US');
    return setTimeout(function(){
      var syn, utt, x$, u;
      syn = (function(){
        try {
          return window.speechSynthesis;
        } catch (e$) {}
      }());
      utt = (function(){
        try {
          return window.SpeechSynthesisUtterance;
        } catch (e$) {}
      }());
      if (!syn || !utt) {
        return;
      }
      x$ = u = new utt(text);
      x$.lang = lang;
      x$.volume = 1.0;
      x$.rate = 1.0;
      return syn.speak(u);
    }, 0);
  };
  AudioControl = React.createClass({
    displayName: 'CUBEBooks.AudioControl',
    getDefaultProps: function(){
      return {
        id: 0,
        audio: null,
        text: '本頁沒有文字'
      };
    },
    getInitialState: function(){
      return {
        loading: true,
        playing: false
      };
    },
    componentWillMount: function(){
      var x$;
      if (!this.props.audio) {
        this.state.loading = false;
        return;
      }
      x$ = this.props.audio;
      x$.on('load', this.onLoad);
      x$.on('play', this.onPlay);
      x$.on('pause', this.onStop);
      x$.on('end', this.onStop);
      return x$;
    },
    componentWillUnmount: function(){
      var x$;
      if (!this.props.audio) {
        return;
      }
      x$ = this.props.audio;
      x$.off('load', this.onLoad);
      x$.off('play', this.onPlay);
      x$.off('pause', this.onStop);
      x$.off('end', this.onStop);
      return x$;
    },
    onLoad: function(){
      return this.setState({
        loading: false
      });
    },
    onPlay: function(){
      return this.setState({
        playing: true
      });
    },
    onStop: function(){
      return this.setState({
        playing: false
      });
    },
    render: function(){
      var classes, ref$, this$ = this;
      classes = 'audio-control';
      if (this.state.playing) {
        classes += ' playing';
      }
      if (this.state.loading) {
        classes += ' loading';
      }
      return div((ref$ = {
        className: classes,
        style: {
          width: '100%',
          height: '100%'
        }
      }, ref$[onClick + ""] = function(it){
        var x$;
        switch (false) {
        case !this$.props.audio:
          if (this$.state.loading) {
            return;
          }
          if (!this$.state.playing) {
            x$ = this$.props.audio;
            x$.stop(this$.props.id);
            x$.play(this$.props.id);
          } else {
            this$.props.audio.pause();
          }
          break;
        default:
          sayIt(this$.props.text, 'zh-TW');
        }
        return this$.props[onClick + ""].call(this$, it);
      }, ref$));
    }
  });
  Character = React.createClass({
    displayName: 'CUBE.Character',
    getDefaultProps: function(){
      return {
        data: null,
        mode: 'zh-TW',
        pinyin: false
      };
    },
    render: function(){
      var data, actived;
      data = this.props.data;
      actived = this.props.pinyin ? 'actived' : '';
      return div({
        className: 'comp character'
      }, div({
        className: "pronounciation " + actived
      }, span(null, data.pinyin)), this.props.mode === 'zh-TW'
        ? div({
          className: 'char zh-TW'
        }, data['zh-TW'])
        : div({
          className: 'char zh-CN'
        }, data['zh-CN']));
    }
  });
  UndoCut = React.createClass({
    displayName: 'CUBE.UndoCut',
    getDefaultProps: function(){
      return {
        actived: false
      };
    },
    render: function(){
      var actived, ref$;
      actived = this.props.actived ? 'actived' : '';
      return div({
        className: 'comp undo-cut ui black icon buttons'
      }, div((ref$ = {
        className: "ui button " + actived
      }, ref$[onClick + ""] = this.props[onClick + ""], ref$), i({
        className: 'repeat icon'
      })));
    }
  });
  ref$ = require('howler'), Howler = ref$.Howler, Howl = ref$.Howl;
  API = require('./api');
  Word = React.createClass({
    displayName: 'CUBE.Word',
    getDefaultProps: function(){
      return {
        data: null,
        mode: 'zh-TW',
        menu: false,
        onStroke: function(){
          throw Error('unimplemented');
        },
        onChildCut: function(){
          throw Error('unimplemented');
        },
        afterChildCut: function(){
          throw Error('unimplemented');
        },
        onChildClick: function(){
          throw Error('unimplemented');
        }
      };
    },
    getInitialState: function(){
      return {
        menu: this.props.menu,
        cut: false,
        pinyin: false,
        meaning: false,
        soundURI: null
      };
    },
    componentWillMount: function(){
      var text, this$ = this;
      if (!this.state.soundURI) {
        text = this.props.data.flatten().map(function(it){
          return it[this$.props.mode];
        }).join('');
        if (text.length === 0) {
          return;
        }
        return API.Talks.get(text, function(err, data){
          if (err) {
            throw err;
          }
          return this$.state.soundURI = data.soundURI();
        });
      }
    },
    componentDidUpdate: function(props, state){
      if (state.cut === false && this.state.cut === true) {
        this.props.afterChildCut(this);
      }
    },
    click: function(){
      return this.props.onChildClick(this);
    },
    render: function(){
      var data, actived, ref$, withHint, this$ = this;
      data = this.props.data;
      actived = this.state.meaning ? 'actived' : '';
      return div((ref$ = {
        className: 'comp word'
      }, ref$[onClick + ""] = function(){
        if (!this$.state.cut) {
          return this$.click();
        }
      }, ref$), this.state.menu ? ActionMenu({
        className: 'menu-cut',
        buttons: ['cut'],
        disabled: [data.children.length === 1],
        onChange: function(it, name, actived){
          var x$;
          if (actived) {
            x$ = this$.props;
            x$.onChildCut(this$);
            x$.onChildClick(this$);
          }
          return this$.setState({
            cut: actived
          });
        }
      }) : void 8, this.state.menu ? (withHint = this.state.pinyin || this.state.meaning ? 'with-hint' : '', ActionMenu({
        className: "menu-learn " + withHint,
        buttons: ['pinyin', 'stroke', 'english'],
        disabled: [false, data.children.length !== 1, false],
        onChange: function(it, name, actived, close){
          var text;
          switch (false) {
          case name !== 'pinyin':
            if (actived) {
              try {
                if (this$.state.soundURI) {
                  Howler.iOSAutoEnable = false;
                  new Howl({
                    autoplay: true,
                    urls: [this$.state.soundURI]
                  });
                } else {
                  text = data.flatten().map(function(it){
                    return it[this$.props.mode];
                  }).join('');
                  sayIt(text, this$.props.mode);
                }
              } catch (e$) {}
            }
            return this$.setState({
              pinyin: actived
            });
          case !(name === 'stroke' && actived):
            return this$.props.onStroke(data.flatten().map(function(it){
              return it['zh-TW'];
            }).join(''), close);
          case name !== 'english':
            if (actived) {
              sayIt(data.short);
            }
            return this$.setState({
              meaning: actived
            });
          }
        }
      })) : void 8, div({
        className: 'characters'
      }, !this.state.cut
        ? (function(){
          var i$, results$ = [];
          for (i$ in data.flatten()) {
            results$.push((fn$.call(this, i$, data.flatten()[i$])));
          }
          return results$;
          function fn$(i, c){
            return Character({
              key: i,
              data: c,
              mode: this.props.mode,
              pinyin: this.state.pinyin
            });
          }
        }.call(this))
        : (function(){
          var i$, results$ = [];
          for (i$ in data.children) {
            results$.push((fn$.call(this, i$, data.children[i$])));
          }
          return results$;
          function fn$(i, c){
            var this$ = this;
            return Word({
              key: i + "-" + c.short,
              ref: i,
              data: c,
              mode: this.props.mode,
              onStroke: function(it, close){
                return this$.props.onStroke(it, close);
              },
              onChildCut: function(it){
                return this$.props.onChildCut(it);
              },
              afterChildCut: function(it){
                return this$.props.afterChildCut(it);
              },
              onChildClick: function(it){
                return this$.props.onChildClick(it);
              }
            });
          }
        }.call(this))), div({
        className: "meaning " + actived
      }, span(null, data.short)));
    }
  });
  ActionMenu = React.createClass({
    icon: function(it){
      switch (false) {
      case it !== 'stroke':
        return 'pencil';
      case it !== 'cut':
        return 'cut';
      case it !== 'pinyin':
        return "volume up";
      case it !== 'english':
        return 'font';
      default:
        return 'question';
      }
    },
    displayName: 'CUBE.ActionMenu',
    getDefaultProps: function(){
      return {
        buttons: ['cut'],
        disabled: [false],
        onChange: function(){
          throw Error('unimplemented');
        }
      };
    },
    getInitialState: function(){
      var actived, i;
      actived = [];
      for (i in this.props.buttons) {
        actived[i] = false;
      }
      return {
        actived: actived
      };
    },
    render: function(){
      var buttons, type;
      buttons = this.props.buttons;
      type = buttons.length === 1 ? 'single' : 'multiple';
      return div({
        className: "actions " + this.props.className
      }, div({
        className: "menu " + type
      }, div({
        className: 'ui buttons'
      }, (function(){
        var i$, results$ = [];
        for (i$ in buttons) {
          results$.push((fn$.call(this, i$, buttons[i$])));
        }
        return results$;
        function fn$(idx, btn){
          var actived, disabled, ref$, this$ = this;
          actived = this.state.actived[idx] ? 'actived' : '';
          disabled = this.props.disabled[idx] ? 'disabled' : '';
          return div((ref$ = {
            key: "button-" + idx,
            className: "ui icon button black " + actived + " " + disabled
          }, ref$[onClick + ""] = function(it){
            var i, actived;
            it.stopPropagation();
            return this$.setState({
              actived: (function(){
                var i$, to$, results$ = [];
                for (i$ = 0, to$ = this.state.actived.length; i$ < to$; ++i$) {
                  i = i$;
                  actived = i === +idx ? !this.state.actived[i] : false;
                  this.props.onChange.call(this, it, buttons[i], actived, fn$);
                  results$.push(actived);
                }
                return results$;
                function fn$(){
                  this$.state.actived[idx] = false;
                  return this$.setState({
                    actived: this$.state.actived
                  });
                }
              }.call(this$))
            });
          }, ref$), i({
            className: "icon " + this.icon(btn)
          }));
        }
      }.call(this)))));
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
        path: './strokes/'
      };
    },
    getInitialState: function(){
      return {
        play: false,
        hide: true,
        words: null,
        stroker: null,
        strokeURI: null
      };
    },
    componentWillUpdate: function(props, state){
      var punc;
      if (!state.words || this.props.fallback) {
        return;
      }
      punc = new RegExp(Object.keys(Data.punctuations).join('|'), 'g');
      state.words = state.words.replace(punc, '');
      if (this.state.hide !== state.hide && state.hide === true) {
        return this.onHide.call(this);
      }
    },
    componentDidUpdate: function(oldProps, oldState){
      var $container, x$;
      $container = $(this.refs.container.getDOMNode());
      $container.empty();
      if (!this.state.words || this.state.words.length === 0 || this.state.strokeURI) {
        return;
      }
      if (!this.state.stroker || oldState.words !== this.state.words) {
        this.state.stroker = new zhStrokeData.SpriteStroker(this.state.words, {
          url: this.props.path,
          speed: 5000,
          width: 215,
          height: 215
        });
      }
      $container.append(this.state.stroker.domElement);
      if (this.state.play) {
        this.state.play = false;
        x$ = this.state.stroker;
        x$.play();
        return x$;
      }
    },
    onHide: function(){
      throw Error('unimplemented');
    },
    render: function(){
      var ref$, this$ = this;
      return div((ref$ = {
        className: 'strokes',
        style: {
          display: !this.state.hide ? 'block' : 'none'
        }
      }, ref$[onClick + ""] = function(){
        return this$.setState({
          hide: true
        });
      }, ref$), !this.state.strokeURI
        ? div({
          className: 'grid'
        })
        : div({
          className: 'fallback',
          style: {
            backgroundImage: "url(" + this.state.strokeURI + "?" + Date.now() + ")"
          }
        }), div({
        ref: 'container'
      }));
    }
  });
  Sentence = React.createClass({
    displayName: 'CUBE.Sentence',
    getDefaultProps: function(){
      return {
        data: null,
        image: '',
        stroke: true,
        sentence: true
      };
    },
    getInitialState: function(){
      return {
        mode: 'zh-TW',
        focus: null,
        undo: []
      };
    },
    componentWillReceiveProps: function(props){
      var ref$;
      if (((ref$ = this.props.data) != null ? ref$.short : void 8) !== ((ref$ = props.data) != null ? ref$.short : void 8)) {
        this.setState({
          focus: this.getInitialState().focus
        });
        $(this.refs.settings.getDOMNode()).height(0);
        return (ref$ = this.refs.stroker) != null ? ref$.setState({
          words: null
        }) : void 8;
      }
    },
    componentDidMount: function(){
      var ref$;
      if (!this.state.focus) {
        return (ref$ = this.refs[0]) != null ? ref$.click() : void 8;
      }
    },
    componentWillUpdate: function(props, state){
      var ref$;
      if (((ref$ = this.props.data) != null ? ref$.short : void 8) === ((ref$ = props.data) != null ? ref$.short : void 8)) {
        switch (false) {
        case this.state.mode === state.mode:
          return console.log('mode changed');
        case this.state.focus !== state.focus:
          return state.focus = null;
        }
      }
    },
    componentDidUpdate: function(props, state){
      var ref$;
      if (((ref$ = this.props.data) != null ? ref$.short : void 8) !== ((ref$ = props.data) != null ? ref$.short : void 8)) {
        this.setState({
          undo: []
        });
        return (ref$ = this.refs[0]) != null ? ref$.click() : void 8;
      }
    },
    toggleMode: function(){
      return this.setState({
        mode: this.state.mode === 'zh-TW' ? 'zh-CN' : 'zh-TW'
      });
    },
    toggleSettings: function(){
      var $settings;
      $settings = $(this.refs.settings.getDOMNode());
      return $settings.animate({
        height: $settings.height() !== 0 ? 0 : 48
      });
    },
    undo: function(){
      var comp, x$;
      if (comp = this.state.undo.pop()) {
        x$ = comp;
        x$.setState({
          cut: false
        });
        x$.click();
      }
    },
    undoAll: function(){
      while (this.state.undo.length) {
        this.undo();
      }
    },
    render: function(){
      var data, words, ref$, focus, this$ = this;
      data = this.props.data;
      words = (data != null ? data.childrenOfDepth(0) : void 8) || [];
      return div({
        className: 'playground',
        style: {
          backgroundImage: "url('" + this.props.image + "')"
        }
      }, div({
        className: 'comp sentence',
        style: {
          display: this.props.sentence ? 'block' : 'none'
        }
      }, this.props.stroke ? Stroker({
        key: "stroker",
        ref: "stroker"
      }) : void 8, (function(){
        var i$, results$ = [];
        for (i$ in words) {
          results$.push((fn$.call(this, i$, words[i$])));
        }
        return results$;
        function fn$(i, word){
          var id, this$ = this;
          id = (split$.call(word.short, ' ')).join('-');
          return Word({
            key: i + "-" + id,
            ref: i,
            data: word,
            mode: this.state.mode,
            onStroke: function(text, close){
              var stroker, x$;
              if (!this$.refs.stroker) {
                return;
              }
              stroker = this$.refs.stroker;
              if (stroker.state.hide) {
                return API.Talks.get(text, function(err, data){
                  var x$;
                  x$ = stroker;
                  x$.onHide = function(){
                    return close();
                  };
                  x$.setState({
                    words: text,
                    play: true,
                    hide: false,
                    strokeURI: data != null ? data.strokeURI()[this$.state.mode] : void 8
                  });
                  return x$;
                });
              } else {
                close();
                x$ = stroker;
                x$.onHide = function(){
                  return close();
                };
                x$.setState({
                  words: null,
                  hide: true
                });
                return x$;
              }
            },
            onChildCut: function(comp){
              this$.state.undo.push(comp);
              comp.setState({
                pinyin: false,
                meaning: false
              });
              return comp.click();
            },
            afterChildCut: function(comp){
              var ref$;
              return (ref$ = comp.refs[0]) != null ? ref$.click() : void 8;
            },
            onChildClick: function(comp){
              var ref$;
              if ((ref$ = this$.refs.stroker) != null) {
                ref$.setState({
                  words: null,
                  hide: true
                });
              }
              if (this$.state.focus === comp) {
                comp.setState({
                  menu: false
                });
                return this$.setState({
                  focus: null
                });
              } else {
                if ((ref$ = this$.state.focus) != null) {
                  ref$.setState({
                    menu: false,
                    pinyin: false,
                    meaning: false
                  });
                }
                comp.setState({
                  menu: true
                });
                return this$.setState({
                  focus: comp
                });
              }
            }
          });
        }
      }.call(this))), nav({
        ref: 'settings',
        className: 'navbar',
        style: {
          height: 0
        }
      }, div({
        className: 'ui borderless menu'
      }, div({
        className: 'right menu'
      }, a((ref$ = {
        className: 'item toggle chinese'
      }, ref$[onClick + ""] = this.toggleMode, ref$), this.state.mode === 'zh-TW' ? '繁' : '简')))), UndoCut((ref$ = {
        actived: this.state.undo.length !== 0
      }, ref$[onClick + ""] = this.undo, ref$)), div({
        className: 'entry'
      }, this.state.focus !== null ? (focus = this.state.focus.props.data, [
        span({
          className: 'ui black label'
        }, focus.flatten().map(function(it){
          return it[this$.state.mode];
        }).join('')), span({
          className: 'definition'
        }, focus.definition)
      ]) : void 8));
    }
  });
  module.exports = {
    AudioControl: AudioControl,
    SettingsButton: SettingsButton,
    Sentence: Sentence
  };
}).call(this);
