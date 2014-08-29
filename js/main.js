(function(){
  var config, resize, dots, dpcm;
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
  CUBEBooks.getPresentation('./json', function(data){
    var viewer;
    viewer = React.renderComponent(ODP.components.presentation({
      scale: resize(dpcm),
      data: data
    }), $('#wrap').get()[0]);
    return $(window).resize(function(){
      return viewer.setProps({
        scale: resize(dpcm)
      });
    });
  });
}).call(this);
