(function(){
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
              var audio, settingsButton, page, forcedDpcm, playRange, viewer;
              audio = React.renderComponent(CUBEBooks.RangedAudio({
                src: setup.path + "/audio.mp3"
              }), $('#audio').get()[0]);
              settingsButton = React.renderComponent(CUBEBooks.SettingsButton(), $('#settings').get()[0]);
              if (/([1-9]\d*)/.exec(location.search) || /page([1-9]\d*)/.exec(location.href)) {
                page = RegExp.$1;
                data.children = [data.children[($('#wrap').data('page') || page) - 1]];
                data.children[0].attrs.y = 0;
                forcedDpcm = 0.98;
              }
              playRange = {
                start: Infinity,
                end: -Infinity
              };
              viewer = React.renderComponent(ODP.components.presentation({
                scale: forcedDpcm || resize(dpcm),
                data: data,
                renderProps: function(props){
                  var data, attrs, range, text, i$, ref$, len$, cue, start, end, x$;
                  data = props.data;
                  attrs = data.attrs;
                  switch (false) {
                  case !(data.name === 'image' && attrs.name === 'activity'):
                    delete attrs.href;
                    delete attrs.onClick;
                    range = playRange;
                    playRange = {
                      start: Infinity,
                      end: -Infinity
                    };
                    return ODP.components.image(props, CUBEBooks.AudioControl({
                      audio: audio,
                      range: range
                    }));
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
                        start = cue.startTime;
                        end = cue.endTime;
                        x$ = playRange;
                        if (playRange.start > start) {
                          x$.start = start;
                        }
                        if (playRange.end < end) {
                          x$.end = end;
                        }
                        break;
                      }
                    }
                    return ODP.components.span(props, ReactVTT.IsolatedCue({
                      target: setup.path + "/audio.vtt",
                      match: text,
                      currentTime: function(){
                        return audio.getDOMNode().currentTime;
                      }
                    }));
                  default:
                    return ODP.renderProps(props);
                  }
                }
              }), $('#wrap').get()[0]);
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
