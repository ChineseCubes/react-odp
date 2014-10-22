(function(){
  var React, DotsDetector, Data, Book, Reader, ReactVTT;
  React = require('react');
  DotsDetector = require('./react-dots-detector');
  Data = require('./CUBE/data');
  Book = require('./Book');
  Reader = require('./Reader');
  ReactVTT = require('react-vtt');
  require('react-vtt/dest/ReactVTT.css');
  window.requestAnimationFrame(function(){
    return $(function(){
      var dots;
      React.initializeTouchEvents(true);
      dots = React.renderComponent(DotsDetector({
        unit: 'cm'
      }), $('#detector').get()[0]);
      return Data.getMasterPage('./LRRH/', function(mp){
        var setup;
        setup = mp.setup;
        return Data.getPresentation(mp, function(data){
          return Data.Segmentations(data, setup.path, function(segs){
            return ReactVTT.parse(setup.path + "/audio.vtt.json", function(vtt){
              var $win, props, x$, reader;
              $win = $(window);
              props = {
                masterPage: mp,
                data: data,
                segs: segs,
                vtt: vtt,
                dpcm: dots.state.x,
                width: $win.width(),
                height: $win.height()
              };
              if (/([1-9]\d*)/.exec(location.search) || /page([1-9]\d*)/.exec(location.href)) {
                x$ = props;
                x$.pages = [RegExp.$1];
                x$.autoFit = false;
              }
              reader = React.renderComponent(Reader(props), $('#app').get()[0]);
              return $win.resize(function(){
                return reader.setProps({
                  width: $win.width(),
                  height: $win.height()
                });
              });
            });
          });
        });
      });
    });
  });
}).call(this);
