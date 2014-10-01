(function(){
  var isNaN, $, React, Data, zhStrokeData, ref$, a, div, i, img, nav, span, onClick, sayIt, AudioControl, Character, UndoCut, API, Word, ActionMenu, SettingsButton, Stroker, Sentence, split$ = ''.split;
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
    var syn, utt, x$, u;
    lang == null && (lang = 'en-US');
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
        var x$, syn, utt, y$, u;
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
          syn = window.speechSynthesis;
          utt = window.SpeechSynthesisUtterance;
          y$ = u = new utt(this$.props.text);
          y$.lang = 'zh-TW';
          y$.volume = 1.0;
          y$.rate = 1.0;
          syn.speak(u);
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
        mode: 'zh_TW',
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
      }, span(null, data.pinyin)), this.props.mode === 'zh_TW'
        ? div({
          className: 'char zh_TW'
        }, data.zh_TW)
        : div({
          className: 'char zh_CN'
        }, data.zh_CN));
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
  API = require('./api');
  Word = React.createClass({
    displayName: 'CUBE.Word',
    getDefaultProps: function(){
      return {
        data: null,
        mode: 'zh_TW',
        menu: false,
        onStroke: function(){
          throw Error('unimplemented');
        },
        onChildCut: function(){
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
    click: function(){
      return this.props.onChildClick(this);
    },
    render: function(){
      var data, lang, actived, ref$, this$ = this;
      data = this.props.data;
      lang = function(it){
        switch (it) {
        case 'zh_TW':
          return 'zh-TW';
        case 'zh_CN':
          return 'zh-CN';
        }
      };
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
        onButtonClick: function(it, name){
          var nextCut, x$;
          nextCut = !this$.state.cut;
          if (nextCut === true) {
            x$ = this$.props;
            x$.onChildCut(this$);
            x$.onChildClick(this$);
          }
          return this$.setState({
            cut: nextCut
          });
        }
      }) : void 8, this.state.menu ? ActionMenu({
        className: 'menu-learn',
        buttons: ['pinyin', 'stroke', 'english'],
        disabled: [false, data.children.length !== 1, false],
        onButtonClick: function(it, name, close){
          var text;
          switch (false) {
          case name !== 'pinyin':
            if (!this$.state.pinyin) {
              text = data.flatten().map(function(it){
                return it[this$.props.mode];
              }).join('');
              if (!this$.state.soundURI) {
                sayIt(text, lang(this$.props.mode));
                API.Talks.get(text, function(err, data){
                  if (err) {
                    throw err;
                  }
                  return this$.state.soundURI = data.soundURI();
                });
              } else {
                try {
                  Howler.iOSAutoEnable = false;
                  new Howl({
                    autoplay: true,
                    urls: [this$.state.soundURI]
                  });
                } catch (e$) {}
              }
            } else {
              close();
            }
            return this$.setState({
              pinyin: !this$.state.pinyin
            });
          case name !== 'stroke':
            return this$.props.onStroke(data.flatten().map(function(it){
              return it.zh_TW;
            }).join(''), close);
          case name !== 'english':
            if (!this$.state.meaning) {
              sayIt(data.short);
            } else {
              close();
            }
            return this$.setState({
              meaning: !this$.state.meaning
            });
          }
        }
      }) : void 8, div({
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
              data: c,
              mode: this.props.mode,
              onStroke: function(it, close){
                return this$.props.onStroke(it, close);
              },
              onChildCut: function(it){
                return this$.props.onChildCut(it);
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
        onButtonClick: function(){
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
            it.stopPropagation();
            this$.props.onButtonClick.call(this$, it, btn, function(){
              var actived;
              actived = Array.prototype.slice.call(this$.state.actived);
              actived[idx] = false;
              return this$.setState({
                actived: actived
              });
            });
            this$.state.actived[idx] = true;
            return this$.forceUpdate();
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
            backgroundImage: "url(" + this.state.strokeURI + ")"
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
        stroke: true
      };
    },
    getInitialState: function(){
      return {
        mode: 'zh_TW',
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
        return this.refs[0].click();
      }
    },
    toggleMode: function(){
      return this.setState({
        mode: this.state.mode === 'zh_TW' ? 'zh_CN' : 'zh_TW'
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
      var data, words, ref$, focus, this$ = this;
      data = this.props.data;
      words = (data != null ? data.childrenOfDepth(0) : void 8) || [];
      return div({
        className: 'playground'
      }, div({
        className: 'comp sentence'
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
                    strokeURI: data != null ? data.strokeURI() : void 8
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
              return comp.setState({
                pinyin: false,
                meaning: false
              });
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
      }, ref$[onClick + ""] = this.toggleMode, ref$), this.state.mode === 'zh_TW' ? '繁' : '简')))), UndoCut((ref$ = {
        actived: this.state.undo.length !== 0
      }, ref$[onClick + ""] = function(){
        var comp;
        comp = this$.state.undo.pop();
        if (comp != null) {
          comp.setState({
            cut: false
          });
        }
        return comp != null ? comp.click() : void 8;
      }, ref$)), div({
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
