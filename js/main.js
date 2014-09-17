(function(){
  var ref$, div, i, small, zipObject, Main;
  ref$ = React.DOM, div = ref$.div, i = ref$.i, small = ref$.small;
  zipObject = _.zipObject;
  Main = React.createClass({
    displayName: 'CUBE.Main',
    getDefaultProps: function(){
      return {
        masterPage: null,
        data: null,
        segs: null,
        vtt: null,
        pages: null,
        autoFit: true,
        dpcm: 37.79527
      };
    },
    getInitialState: function(){
      var setup, audio, this$ = this;
      setup = this.props.masterPage.setup;
      audio = new Howl({
        urls: [setup.path + "/audio.mp3"]
      }).on('end', function(){
        return this$.state.currentSprite = null;
      });
      return {
        scale: this.resize(this.props.dpcm),
        audio: audio,
        sprite: {},
        currentSprite: null,
        text: ''
      };
    },
    componentWillMount: function(){
      var this$ = this;
      if (window) {
        return $(window).resize(function(){
          return this$.setState({
            scale: this$.resize(this$.props.dpcm)
          });
        });
      }
    },
    componentDidMount: function(){
      this.state.audio.sprite(this.state.sprite);
      if (!this.props.autoFit) {
        return $.fn.modal = function(){
          var this$ = this;
          this.fadeIn('fast');
          this.css({
            marginTop: '-200px',
            opacity: 0.9
          });
          $('#wrap').css('opacity', 0.5);
          this.on('click', '.close', function(){
            return $('#wrap').css('opacity', 1, this$.fadeOut('fast'));
          });
          return $('#wrap').one('click', function(){
            return $('#wrap').css('opacity', 1, this$.fadeOut('fast'));
          });
        };
      }
    },
    resize: function(dpcm){
      var $window, setup, ratio, pxWidth, pxHeight, width, height;
      if (!window || !this.props.autoFit) {
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
              var range, r, x$, this$ = this;
              range = {
                start: Infinity,
                end: -Infinity
              };
              while (r = ranges.pop()) {
                x$ = range;
                if (r.start < range.start) {
                  x$.start = r.start;
                }
                if (r.end > range.end) {
                  x$.end = r.end;
                }
              }
              if (range.start > range.end) {
                range = {
                  start: range.end,
                  end: range.start
                };
              }
              this.state.sprite[counter] = [range.start * 1000, (range.end - range.start) * 1000];
              return ODP.components.image(props, CUBEBooks.AudioControl({
                id: counter,
                audio: this.state.audio,
                onClick: function(){
                  return this$.state.currentSprite = this$.state.sprite[counter];
                }
              }));
            }.call(this$, counter));
            ++counter;
            return comp;
          case !(data.name === 'span' && data.text):
            text = props.data.text;
            delete props.data.text;
            attrs.onClick = function(){
              this$.setState({
                text: text
              });
              return $(this$.refs.modal.getDOMNode()).modal({
                detachable: false
              }).modal('show');
            };
            for (i$ = 0, len$ = (ref$ = this$.props.vtt.cues).length; i$ < len$; ++i$) {
              cue = ref$[i$];
              if (cue.text === text) {
                ranges.push({
                  start: cue.startTime,
                  end: cue.endTime
                });
                break;
              }
            }
            return ODP.components.span(props, ReactVTT.IsolatedCue({
              target: setup.path + "/audio.vtt",
              match: text,
              currentTime: function(){
                if (this$.state.currentSprite) {
                  return this$.state.currentSprite[0] / 1000 + this$.state.audio.pos();
                } else {
                  return 0;
                }
              }
            }));
          default:
            return ODP.renderProps(props);
          }
        }
      }));
    }
  });
  window.requestAnimationFrame(function(){
    return $(function(){
      var dots;
      dots = React.renderComponent(DotsDetector({
        unit: 'cm'
      }), $('#detector').get()[0]);
      return Data.getMasterPage('./LRRH/', function(mp){
        var setup;
        setup = mp.setup;
        return Data.getPresentation(mp, function(data){
          return Data.Segmentations(data, setup.path, function(segs){
            return ReactVTT.parse(setup.path + "/audio.vtt", function(vtt){
              return React.renderComponent(Main({
                masterPage: mp,
                data: data,
                segs: segs,
                vtt: vtt,
                dpcm: dots.state.x
              }), $('#wrap').get()[0]);
            });
          });
        });
      });
    });
  });
  function in$(x, xs){
    var i = -1, l = xs.length >>> 0;
    while (++i < l) if (x === xs[i]) return true;
    return false;
  }
}).call(this);
