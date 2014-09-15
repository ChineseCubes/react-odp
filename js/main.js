(function(){
  var zipObject;
  zipObject = _.zipObject;
  window.requestAnimationFrame(function(){
    return $(function(){
      return Data.getMasterPage('./LRRH/', function(mp){
        var setup, resize, dots, dpcm;
        setup = mp.setup;
        resize = function(dpcm){
          var ratio, pxWidth, pxHeight, width, height;
          ratio = setup.ratio;
          pxWidth = setup.width * dpcm;
          pxHeight = setup.height * dpcm;
          width = $(window).width();
          height = $(window).height();
          if (width / ratio < height) {
            return width / pxWidth;
          } else {
            return height / pxHeight;
          }
        };
        dots = React.renderComponent(DotsDetector({
          unit: 'cm'
        }), $('#detector').get()[0]);
        dpcm = dots.state.x;
        console.log("dpcm: " + dpcm);
        return Data.getPresentation(mp, function(data){
          return Data.Segmentations(data, setup.path, function(segs){
            return ReactVTT.parse(setup.path + "/audio.vtt", function(vtt){
              var ranges, res$, i$, ref$, len$, cue, settingsButton, page, forcedDpcm, audio, counter, sprite, currentSprite, viewer;
              res$ = [];
              for (i$ = 0, len$ = (ref$ = vtt.cues).length; i$ < len$; ++i$) {
                cue = ref$[i$];
                res$.push([cue.startTime * 1000, (cue.endTime - cue.startTime) * 1000]);
              }
              ranges = res$;
              settingsButton = React.renderComponent(CUBEBooks.SettingsButton(), $('#settings').get()[0]);
              if (/([1-9]\d*)/.exec(location.search) || /page([1-9]\d*)/.exec(location.href)) {
                page = RegExp.$1;
                data.children = [data.children[($('#wrap').data('page') || page) - 1]];
                data.children[0].attrs.y = 0;
                forcedDpcm = 0.98;
              }
              audio = new Howl({
                urls: [setup.path + "/audio.mp3"]
              });
              counter = 0;
              ranges = [];
              sprite = {};
              currentSprite = null;
              audio.on('end', function(){
                return currentSprite = null;
              });
              viewer = React.renderComponent(ODP.components.presentation({
                scale: forcedDpcm || resize(dpcm),
                data: data,
                renderProps: function(props){
                  var data, attrs, comp, text, i$, ref$, len$, cue;
                  data = props.data;
                  attrs = data.attrs;
                  switch (false) {
                  case !(data.name === 'image' && attrs.name === 'activity'):
                    delete attrs.href;
                    delete attrs.onClick;
                    comp = (function(counter){
                      var range, r, x$;
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
                      sprite[counter] = [range.start * 1000, (range.end - range.start) * 1000];
                      return ODP.components.image(props, CUBEBooks.AudioControl({
                        id: counter,
                        audio: audio,
                        onClick: function(){
                          return currentSprite = sprite[counter];
                        }
                      }));
                    }.call(this, counter));
                    ++counter;
                    return comp;
                  case !(data.name === 'span' && data.text):
                    text = props.data.text;
                    delete props.data.text;
                    attrs.onClick = function(){
                      var sentence;
                      sentence = React.renderComponent(CUBEBooks.Sentence({
                        data: segs.get(text)
                      }), $('#control > .content').get()[0]);
                      settingsButton.setProps({
                        onClick: sentence.toggleSettings
                      });
                      return $('#control').modal('show');
                    };
                    for (i$ = 0, len$ = (ref$ = vtt.cues).length; i$ < len$; ++i$) {
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
                        if (currentSprite) {
                          return currentSprite[0] / 1000 + audio.pos();
                        } else {
                          return 0;
                        }
                      }
                    }));
                  default:
                    return ODP.renderProps(props);
                  }
                }
              }), $('#wrap').get()[0], function(){
                return audio.sprite(sprite);
              });
              if (forcedDpcm) {
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
                    return $('#wrap').css('opacity', 1, this$.fastOut('fast'));
                  });
                };
              } else {
                return $(window).resize(function(){
                  return viewer.setProps({
                    scale: resize(dpcm)
                  });
                });
              }
            });
          });
        });
      });
    });
  });
}).call(this);
