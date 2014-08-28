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
    /**
    time = 0
    requestAnimationFrame update = ->
      time += 1/60s
      time %= 18s
      requestAnimationFrame update
    data <<< do
      renderProps: (props) ->
        if props.text
          text = props.text
          delete props.text
          #ODP.components.span do
          #  props
          #  ReactVTT.IsolatedCue do
          #    target: './json/demo.vtt'
          #    #index: span-count++
          #    match: text
          #    currentTime: -> time
        else
          ODP.renderProps props
    /**/
    var viewer, resize;
    viewer = ODP.renderComponent(data, $('#wrap').get()[0]);
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
