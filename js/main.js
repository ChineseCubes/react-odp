(function(){
  $.getJSON('./json/page1.json', function(data){
    var config, dots, dpcm, tree, viewer, resize;
    import$(data['@attributes'], {
      x: '0',
      y: '0',
      width: '28cm',
      height: '21cm'
    });
    data = {
      page: data
    };
    config = {
      pageSetup: {
        ratio: 4 / 3,
        x: 0,
        y: 0,
        width: 28,
        height: 21
      }
    };
    dots = React.renderComponent(ODP.DotsDetector({
      unit: 'cm'
    }), $('#detector').get()[0]);
    dpcm = dots.state.x;
    console.log("dpcm: " + dpcm);
    tree = ODP.map(data, function(it){
      return it['@attributes'] || [];
    });
    viewer = React.renderComponent(ODP.Presentation({
      value: {
        x: '0',
        y: '0',
        width: '28cm',
        height: '21cm'
      },
      children: tree
    }), $('#wrap').get()[0]);
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
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
