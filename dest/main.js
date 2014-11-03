(function(){
  var React, DotsDetector, Data, Book, Reader, ReactVTT, parse;
  React = require('react');
  DotsDetector = React.createFactory(require('./react-dots-detector'));
  Data = require('./CUBE/data');
  Book = React.createFactory(require('./Book'));
  Reader = React.createFactory(require('./Reader'));
  ReactVTT = require('react-vtt');
  require('react-vtt/dest/ReactVTT.css');
  parse = function(filename, done){
    return ReactVTT.parse(filename, function(){
      return done.apply(this, arguments);
    }).error(function(){
      return done(null);
    });
  };
  window.requestAnimationFrame(function(){
    return $(function(){
      var dots;
      React.initializeTouchEvents(true);
      dots = React.render(DotsDetector({
        unit: 'cm'
      }), $('#detector').get()[0]);
      return Data.getMasterPage('./data/', function(mp){
        var setup;
        setup = mp.setup;
        return Data.getPresentation(mp, function(data){
          return Data.Segmentations(data, setup.path, function(segs){
            return parse(setup.path + "/audio.vtt.json", function(vtt){
              var $win, props, reader;
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
                props.pages = [RegExp.$1];
              }
              reader = React.render(Reader(props), $('#app').get()[0]);
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
