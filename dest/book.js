(function(){
  var React, ReactVTT, CUBEBooks, ODP, ref$, div, i, small, Book;
  React = require('react');
  ReactVTT = require('react-vtt');
  CUBEBooks = require('./CUBEBooks/components');
  ODP = require('./ODP/components');
  ref$ = React.DOM, div = ref$.div, i = ref$.i, small = ref$.small;
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
        text: ''
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
        require('react-vtt/css/react-vtt.css');
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
      try {
        window.console.log(this.state.sprite);
      } catch (e$) {}
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
      var setup, counter, ranges, this$ = this;
      setup = this.props.masterPage.setup;
      counter = 0;
      ranges = [];
      return div({
        className: 'comp main'
      }, div({
        ref: 'modal',
        className: 'ui modal control'
      }, i({
        className: 'close icon'
      }), div({
        className: 'header'
      }, CUBEBooks.SettingsButton({
        className: 'settings',
        onClick: function(){
          return this$.refs.sentence.toggleSettings();
        }
      }), 'C', small(null, 'UBE'), 'Control'), div({
        className: 'content'
      }, CUBEBooks.Sentence({
        ref: 'sentence',
        data: this.props.segs.get(this.state.text)
      }))), ODP.components.presentation({
        ref: 'presentation',
        scale: this.state.scale,
        data: this.props.data,
        renderProps: function(props){
          var pages, data, attrs, comp, text, i$, ref$, len$, cue;
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
          data = props.data;
          attrs = data.attrs;
          switch (false) {
          case data.name !== 'page':
            if (in$(attrs.name, pages)) {
              return ODP.renderProps(props);
            }
            break;
          case !(data.name === 'image' && attrs.name === 'activity'):
            delete attrs.href;
            delete attrs.onClick;
            comp = (function(counter){
              var text, range, r, x$, id, this$ = this;
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
                return ODP.components.image(props, CUBEBooks.AudioControl({
                  id: id,
                  audio: this.state.audio,
                  text: text,
                  onClick: function(){
                    return this$.state.currentSprite = this$.state.sprite[id];
                  }
                }));
              }
            }.call(this$, counter));
            ++counter;
            return comp;
          case !(data.name === 'span' && data.text):
            text = props.data.text;
            attrs.onClick = function(){
              var $pages, $modal, show;
              this$.setState({
                text: text
              });
              this$.setProps({
                showText: false
              });
              $pages = $('.office.presentation');
              $modal = $(this$.refs.modal.getDOMNode());
              show = function(){
                $pages.css('opacity', 1);
                $modal.fadeOut('fast');
                return this$.setProps({
                  showText: true
                });
              };
              $pages.css('opacity', 0.5);
              return $modal.fadeIn('fast').css({
                marginTop: '-200px',
                opacity: 0.9
              }).one('click', '.close', show);
            };
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
