(function(){
  var React, DotsDetector, Data, API, Book, ReactVTT, log;
  React = require('react');
  DotsDetector = require('./react-dots-detector');
  Data = require('./CUBEBooks/data');
  API = require('./CUBEBooks/api');
  Book = require('./book');
  ReactVTT = require('react-vtt');
  log = function(it){
    try {
      return window.console.log(it);
    } catch (e$) {}
  };
  API.Talks.get('愛', function(err, ai){
    log(err) || ai;
    return ai != null ? ai.getStroke(function(err, g){
      log(err) || g;
      return ai != null ? ai.getSound(function(err, s){
        return log(err) || s;
      }) : void 8;
    }) : void 8;
  });
  API.Talks.get('我愛你', function(err, ai){
    log(err) || ai;
    return ai != null ? ai.getSound(function(err, s){
      return log(err) || s;
    }) : void 8;
  });
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
