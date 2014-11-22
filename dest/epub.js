(function(){
  var React, DotsDetector, Data, Book, ReactVTT, request, getMp3, getVtt;
  React = require('react');
  DotsDetector = React.createFactory(require('./react-dots-detector'));
  Data = require('./CUBE/data');
  Book = React.createFactory(require('./Book'));
  ReactVTT = require('react-vtt');
  require('react-vtt/dest/ReactVTT.css');
  request = require('request');
  getMp3 = function(filename, done){
    return request(filename, function(err, res, body){
      if (err) {
        console.warn(err);
        return done({
          mp3: null
        });
      } else {
        return done(JSON.parse(body));
      }
    });
  };
  getVtt = function(filename, done){
    return ReactVTT.parse(filename, done).error(function(){
      return done(null);
    });
  };
  window.requestAnimationFrame(function(){
    var dots;
    React.initializeTouchEvents(true);
    dots = React.render(DotsDetector({
      unit: 'cm'
    }), document.getElementById('detector'));
    return Data.getMasterPage('./data/', function(mp){
      var setup;
      setup = mp.setup;
      return Data.getPresentation(mp, function(data){
        return Data.Segmentations(data, setup.path, function(segs){
          return getMp3(setup.path + "/audio.mp3.json", function(arg$){
            var mp3;
            mp3 = arg$.mp3;
            return getVtt(setup.path + "/audio.vtt.json", function(vtt){
              var props;
              props = {
                masterPage: mp,
                data: data,
                segs: segs,
                audio: mp3 || setup.path + "/audio.mp3",
                vtt: vtt,
                dpcm: dots.state.x
              };
              if (/([1-9]\d*)/.exec(location.search) || /page([1-9]\d*)/.exec(location.href)) {
                props.pages = [RegExp.$1];
              }
              return React.render(Book(props), document.getElementById('app'));
            });
          });
        });
      });
    });
  });
}).call(this);
