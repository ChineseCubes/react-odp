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
  CUBEBooks.getPresentation('./json-v2.1', function(data){
    var viewer, resize;
    viewer = ODP.renderComponent(data, $('#wrap').get()[0]);
    /**
     * custom components
     **
    viewer.setProps do
      shouldRenderChild: (props) -> if props.name is 'p' then false else true
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
