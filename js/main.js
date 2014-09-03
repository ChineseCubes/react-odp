(function(){
  var config, resize, dots, dpcm, audio;
  config = {
    pageSetup: {
      ratio: 4 / 3,
      x: 0,
      y: 0,
      width: 28,
      height: 21
    }
  };
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
  Data.getPresentation('./json', function(data){
    var viewer;
    Data.buildSyntaxTreeFromNotes(data);
    viewer = React.renderComponent(ODP.components.presentation({
      scale: resize(dpcm),
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
            console.log("query " + text);
            return Data.getSegmentations(text, function(seg){
              React.renderComponent(CUBEBooks.Sentence({
                data: seg
              }), $('#control .content .sentence').get()[0]);
              return $('#control').modal('show');
            });
          };
          return ODP.components.span(props, ReactVTT.IsolatedCue({
            target: './json/demo.vtt',
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
    return $(window).resize(function(){
      return viewer.setProps({
        scale: resize(dpcm)
      });
    });
  });
}).call(this);
