(function(){
  var React, ReactVTT, ODP, Button, ref$, div, i, small, onClick, Playground, AudioControl, Howler, Howl, Book;
  React = require('react');
  ReactVTT = require('react-vtt');
  ODP = require('./ODP');
  Button = require('./CUBE/UI/Button');
  ref$ = React.DOM, div = ref$.div, i = ref$.i, small = ref$.small;
  onClick = require('./CUBE/utils').onClick;
  ref$ = require('./CUBE/Book'), Playground = ref$.Playground, AudioControl = ref$.AudioControl;
  ref$ = require('howler'), Howler = ref$.Howler, Howl = ref$.Howl;
  Book = React.createClass({
    displayName: 'CUBE.Book',
    getDefaultProps: function(){
      return {
        masterPage: null,
        data: null,
        segs: null,
        vtt: null,
        pages: null,
        autoFit: true,
        dpcm: 37.79527,
        showText: true
      };
    },
    getInitialState: function(){
      return {
        scale: this.resize(this.props.dpcm),
        audio: null,
        sprite: {},
        currentSprite: null,
        text: '',
        pageNumber: 0
      };
    },
    componentWillMount: function(){
      var setup, audio, this$ = this;
      if (this.props.autoFit) {
        $(window).resize(function(){
          return this$.setState({
            scale: this$.resize(this$.props.dpcm)
          });
        });
      }
      setup = this.props.masterPage.setup;
      audio = (function(){
        try {
          Howler.iOSAutoEnable = false;
          return new Howl({
            urls: [setup.path + "/audio.mp3"]
          });
        } catch (e$) {}
      }());
      if (audio) {
        audio.on('end', function(){
          return this$.state.currentSprite = null;
        });
      }
      return this.setState({
        audio: audio
      });
    },
    componentDidMount: function(){
      var ref$;
      return (ref$ = this.state.audio) != null ? ref$.sprite(this.state.sprite) : void 8;
    },
    resize: function(dpcm){
      var $window, setup, ratio, pxWidth, pxHeight, width, height;
      if (!this.props.autoFit) {
        return 0.98;
      }
      $window = $(window);
      setup = this.props.masterPage.setup;
      ratio = setup.ratio;
      pxWidth = setup.width * this.props.dpcm;
      pxHeight = setup.height * this.props.dpcm;
      width = $window.width();
      height = $window.height();
      if (width / ratio < height) {
        return width / pxWidth;
      } else {
        return height / pxHeight;
      }
    },
    render: function(){
      var setup, counter, ranges, attrs, offsetX, ref$, this$ = this;
      setup = this.props.masterPage.setup;
      counter = 0;
      ranges = [];
      attrs = this.props.data.attrs;
      offsetX = "-" + this.state.pageNumber * +attrs.width.replace('cm', '') + "cm";
      return div({
        className: 'main'
      }, div({
        ref: 'modal',
        className: 'modal hidden'
      }, div({
        className: 'header'
      }, Button((ref$ = {
        className: 'settings'
      }, ref$[onClick + ""] = function(){
        return this$.refs.playground.toggleSettings();
      }, ref$), 'Settings'), 'C', small(null, 'UBE'), 'Control'), div({
        className: 'content'
      }, Playground({
        ref: 'playground',
        data: this.props.segs.get(this.state.text)
      })), Button({
        className: 'close'
      }, '✖')), ODP.components.presentation({
        ref: 'presentation',
        scale: this.state.scale,
        data: this.props.data,
        renderProps: function(props){
          var pages, parents, data, attrs, key$, comp, text, hide, show, page, x$, i$, ref$, len$, cue;
          if (!this$.props.pages) {
            this$.props.pages = (function(){
              var i$, to$, results$ = [];
              for (i$ = 1, to$ = setup.totalPages; i$ <= to$; ++i$) {
                results$.push(i$);
              }
              return results$;
            }());
          }
          pages = this$.props.pages.map(function(it){
            return "page" + it;
          });
          parents = props.parents;
          data = props.data;
          attrs = data.attrs;
          switch (false) {
          case data.name !== 'page':
            attrs.x = offsetX;
            this$[key$ = attrs.name] == null && (this$[key$] = {
              go: function(){
                return this$.setState({
                  pageNumber: +attrs.name.replace('page', '') - 1
                });
              },
              speak: function(){
                throw Error('unimplemented');
              },
              sentences: [],
              playgrounds: []
            });
            if (in$(attrs.name, pages)) {
              return ODP.renderProps(props);
            }
            break;
          case !(data.name === 'image' && attrs.name === 'activity'):
            delete attrs.href;
            delete attrs[onClick + ""];
            comp = (function(counter){
              var text, range, r, x$, id, book, ref$, this$ = this;
              text = '';
              range = {
                start: Infinity,
                end: -Infinity
              };
              while (r = ranges.pop()) {
                text = r.text + text;
                x$ = range;
                if (r.start < range.start) {
                  x$.start = r.start;
                }
                if (r.end > range.end) {
                  x$.end = r.end;
                }
              }
              id = "segment-" + counter;
              this.state.sprite[id] = [range.start * 1000, (range.end - range.start) * 1000];
              if (range.start < range.end) {
                book = this;
                return ODP.components.image(props, AudioControl((ref$ = {
                  id: id,
                  audio: this.state.audio,
                  text: text,
                  onMount: function(){
                    var this$ = this;
                    return book[parents[1].name].speak = function(){
                      return this$.play();
                    };
                  }
                }, ref$[onClick + ""] = function(){
                  return this$.state.currentSprite = this$.state.sprite[id];
                }, ref$)));
              }
            }.call(this$, counter));
            ++counter;
            return comp;
          case !(data.name === 'span' && data.text):
            text = props.data.text;
            hide = function(){
              $('.office.presentation').css('opacity', 1);
              $(this$.refs.modal.getDOMNode()).fadeOut('fast').toggleClass('hidden', true);
              return this$.setProps({
                showText: true
              });
            };
            show = function(){
              var $modal, height;
              this$.setState({
                text: text
              });
              this$.setProps({
                showText: false
              });
              $modal = $(this$.refs.modal.getDOMNode());
              height = $modal.height();
              $('.office.presentation').css('opacity', 0.5);
              return $modal.fadeIn('fast').toggleClass('hidden', false).one('click', '.close', hide);
            };
            page = this$[parents[1].name];
            if (!in$(text, page.sentences)) {
              x$ = page;
              x$.sentences.push(text);
              x$.playgrounds.push({
                toggle: function(it){
                  if (it) {
                    return show();
                  } else {
                    return hide();
                  }
                }
              });
            }
            attrs[onClick + ""] = show;
            if (!this$.props.showText) {
              attrs.style.display = 'none';
            }
            if (!this$.state.audio) {
              ranges.push({
                text: text,
                start: 0,
                end: 1
              });
              return ODP.renderProps(props);
            } else {
              if (this$.props.vtt) {
                for (i$ = 0, len$ = (ref$ = this$.props.vtt.cues).length; i$ < len$; ++i$) {
                  cue = ref$[i$];
                  if (cue.text === text) {
                    ranges.push({
                      text: text,
                      start: cue.startTime,
                      end: cue.endTime
                    });
                    break;
                  }
                }
              }
              delete props.data.text;
              return ODP.components.span(props, ReactVTT.IsolatedCue({
                target: setup.path + "/audio.vtt.json",
                match: text,
                currentTime: function(){
                  var ref$;
                  return (((ref$ = this$.state.currentSprite) != null ? ref$[0] : void 8) || 0) / 1000 + (((ref$ = this$.state.audio) != null ? ref$.pos() : void 8) || 0);
                }
              }));
            }
            break;
          default:
            return ODP.renderProps(props);
          }
        }
      }));
    }
  });
  module.exports = Book;
  function in$(x, xs){
    var i = -1, l = xs.length >>> 0;
    while (++i < l) if (x === xs[i]) return true;
    return false;
  }
}).call(this);
