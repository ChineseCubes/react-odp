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
  CUBEBooks.getPresentation('./json', function(data){
    var viewer, time, update;
    viewer = React.renderComponent(ODP.components.presentation({
      scale: resize(dpcm),
      data: data
      /**/,
      renderProps: function(props){
        var text;
        if (props.data.name === 'image' && props.data.attrs.onclick === 'activity') {
          delete props.data.attrs.onclick;
          return ODP.components.image(props, CUBEBooks.AudioControl({
            element: audio
          }));
        } else if (props.data.text) {
          text = props.data.text;
          delete props.data.text;
          return ODP.components.span(props, ReactVTT.IsolatedCue({
            target: './json/demo.vtt',
            match: text,
            currentTime: function(){
              return audio.currentTime;
            }
          }));
        } else {
          return ODP.renderProps(props);
        }
      }
      /**/
    }), $('#wrap').get()[0]);
    $(window).resize(function(){
      return viewer.setProps({
        scale: resize(dpcm)
      });
    });
    /**/
    time = 0;
    return requestAnimationFrame(update = function(){
      time += 1 / 60;
      time %= 18;
      return requestAnimationFrame(update);
    });
  });
}).call(this);
