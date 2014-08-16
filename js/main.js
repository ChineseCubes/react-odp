(function(){
  $.getJSON('./json/page1.json', function(data){
    var config, tree, viewer, resize;
    import$(data['@attributes'], {
      x: 0,
      y: 0,
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
    tree = ODP.map(data, function(it){
      var cm, v;
      cm = ODP.numberFromCM;
      v = it['@attributes'];
      if (!v) {
        return {};
      }
      if (v.x) {
        v.x = 100 * cm(v.x) / config.pageSetup.width;
      }
      if (v.y) {
        v.y = 100 * cm(v.y) / config.pageSetup.height;
      }
      if (v.width) {
        v.width = 100 * cm(v.width) / config.pageSetup.width;
      }
      if (v.height) {
        v.height = 100 * cm(v.height) / config.pageSetup.height;
      }
      v.x = v.x + "%";
      v.y = v.y + "%";
      v.width = v.width + "%";
      v.height = v.height + "%";
      return v;
    });
    console.log(tree);
    viewer = React.renderComponent(ODP.Viewer({
      value: {
        x: 0,
        y: 0,
        width: 100,
        height: 100
      },
      children: tree
    }), $('#wrap').get()[0]);
    (resize = function(){
      var ratio, width, height, v, x$, y$;
      ratio = config.pageSetup.ratio;
      width = $(window).width();
      height = $(window).height();
      v = viewer.props.value;
      if (width / ratio < height) {
        x$ = v;
        x$.width = width;
        x$.height = width / ratio;
        return viewer.setProps({
          value: v
        });
      } else {
        y$ = v;
        y$.width = height * ratio;
        y$.height = height;
        return viewer.setProps({
          value: v
        });
      }
    })();
    return $(window).resize(resize);
  });
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
