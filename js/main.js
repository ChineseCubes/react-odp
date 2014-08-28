(function(){
  var config, dots, dpcm;
  config = {
    pageSetup: {
      ratio: 4 / 3,
      x: 0,
      y: 0,
      width: 28,
      height: 21
    }
  };
  dots = React.renderComponent(DotsDetector({
    unit: 'cm'
  }), $('#detector').get()[0]);
  dpcm = dots.state.x;
  console.log("dpcm: " + dpcm);
  CUBEBooks.getPresentation('./json', function(data){
    var viewer, time, update, resize;
    viewer = ODP.renderComponent(data, $('#wrap').get()[0]);
    /**/
    time = 0;
    requestAnimationFrame(update = function(){
      time += 1 / 60;
      time %= 18;
      return requestAnimationFrame(update);
    });
    viewer.setProps({
      renderProps: function(props){
        var text;
        if (props.data.text) {
          text = props.data.text;
          delete props.data.text;
          return ODP.components.span(props, ReactVTT.IsolatedCue({
            target: './json/demo.vtt',
            match: text,
            currentTime: function(){
              return time;
            }
          }));
        } else {
          return ODP.renderProps(props);
        }
      }
    });
    /**/
    (resize = function(){
      var ratio, pxWidth, pxHeight, width, height, s;
      ratio = config.pageSetup.ratio;
      pxWidth = config.pageSetup.width * dpcm;
      pxHeight = config.pageSetup.height * dpcm;
      width = $(window).width();
      height = $(window).height();
      s = width / ratio < height
        ? width / pxWidth
        : height / pxHeight;
      return viewer.setProps({
        scale: s
      });
    })();
    return $(window).resize(resize);
  });
}).call(this);
