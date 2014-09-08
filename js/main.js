(function(){
  var config;
  config = {
    path: './demo'
  };
  window.requestAnimationFrame(function(){
    return $(function(){
      return $.getJSON(config.path + "/masterpage.json", function(arg$){
        var attrs, width, height, orientation, ratio, resize, dots, dpcm, audio, settingsButton;
        attrs = arg$.attrs;
        width = parseInt(attrs['FO:PAGE-WIDTH'], 10);
        height = parseInt(attrs['FO:PAGE-HEIGHT'], 10);
        orientation = attrs['STYLE:PRINT-ORIENTATION'];
        ratio = orientation === 'landscape'
          ? width / height
          : height / width;
        import$(config, {
          pageSetup: {
            ratio: ratio,
            x: 0,
            y: 0,
            width: width,
            height: height,
            totalPages: attrs['TOTAL-PAGES']
          }
        });
        resize = function(dpcm){
          var ratio, pxWidth, pxHeight, width, height;
          ratio = config.pageSetup.ratio;
          pxWidth = config.pageSetup.width * dpcm;
          pxHeight = config.pageSetup.height * dpcm;
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
        audio = $('audio').get()[0];
        settingsButton = React.renderComponent(CUBEBooks.SettingsButton(), $('#settings').get()[0]);
        return Data.getPresentation(config.path, config.pageSetup.totalPages, function(data){
          var page, forcedDpcm, viewer;
          Data.buildSyntaxTreeFromNotes(data);
          if (/([1-9]\d*)/.exec(location.search) || /page([1-9]\d*)/.exec(location.href)) {
            page = RegExp.$1;
            data.children = [data.children[($('#wrap').data('page') || page) - 1]];
            data.children[0].attrs.y = 0;
            forcedDpcm = 0.98;
          }
          viewer = React.renderComponent(ODP.components.presentation({
            scale: forcedDpcm || resize(dpcm),
            data: data
            /**/,
            renderProps: function(props){
              var data, attrs, text;
              data = props.data;
              attrs = data.attrs;
              switch (false) {
              case !(data.name === 'image' && attrs.name === 'activity'):
                delete attrs.href;
                delete attrs.onClick;
                return ODP.components.image(props, CUBEBooks.AudioControl({
                  element: audio
                }));
              case !(data.name === 'span' && data.text):
                text = props.data.text;
                delete props.data.text;
                attrs.onClick = function(){
                  return Data.getSegmentations(text, function(seg){
                    var sentence;
                    sentence = React.renderComponent(CUBEBooks.Sentence({
                      data: seg
                    }), $('#control > .content').get()[0]);
                    settingsButton.setProps({
                      onClick: sentence.toggleSettings
                    });
                    return $('#control').modal('show');
                  });
                };
                return ODP.components.span(props, ReactVTT.IsolatedCue({
                  target: config.path + "/demo.vtt",
                  match: text,
                  currentTime: function(){
                    return audio.currentTime;
                  }
                }));
              default:
                return ODP.renderProps(props);
              }
            }
            /**/
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
                return $('#wrap').css('opacity', 1, this$.fadeOut('fast'));
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
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
