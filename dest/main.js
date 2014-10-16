(function(){
  var React, DotsDetector, Data, Book, ReactVTT;
  React = require('react');
  DotsDetector = require('./react-dots-detector');
  Data = require('./CUBE/data');
  Book = require('./Book');
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
              var props, x$;
              props = {
                masterPage: mp,
                data: data,
                segs: segs,
                vtt: vtt,
                dpcm: dots.state.x
              };
              if (/([1-9]\d*)/.exec(location.search) || /page([1-9]\d*)/.exec(location.href)) {
                x$ = props;
                x$.pages = [RegExp.$1];
                x$.autoFit = false;
              }
              return React.renderComponent(Book(props), $('#app').get()[0]);
            });
          });
        });
      });
    });
  });
}).call(this);
