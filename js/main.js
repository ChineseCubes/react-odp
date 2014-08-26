(function(){
  var config, dots, dpcm, getPages;
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
  getPages = function(done){
    var pages, counter, gotOne, i$, results$ = [];
    pages = [];
    counter = 0;
    gotOne = function(data, i){
      data.attrs.y = i * 21.5 + "cm";
      pages.push(data);
      counter += 1;
      if (counter === 8) {
        return done({
          name: 'presentation',
          x: '0',
          y: '0',
          width: '28cm',
          height: '21cm',
          children: pages
        });
      }
    };
    for (i$ = 1; i$ <= 8; ++i$) {
      results$.push((fn$.call(this, i$)));
    }
    return results$;
    function fn$(i){
      return CUBEBooks.getPageJSON("./json-v2.1/page" + i + ".json", function(it){
        return gotOne(it, i - 1);
      });
    }
  };
  getPages(function(data){
    var viewer, resize;
    viewer = ODP.renderComponent(data, $('#wrap').get()[0]);
    /**
     * custom components
     **
    viewer.setProps do
      components:
        p: React.createClass do
          displayName: \CustomP
          render: ->
            React.DOM.div do
              style:
                width:      100
                height:     100
                background: \red
     */
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
