(function(){
  var React, DotsDetector, Data, Audio, Book, Reader, ReactVTT, request, getMp3, getVtt;
  React = require('react');
  DotsDetector = React.createFactory(require('./react-dots-detector'));
  Data = require('./CUBE/data');
  Audio = require('./Logic/Audio');
  Book = React.createFactory(require('./Book'));
  Reader = React.createFactory(require('./Reader'));
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
            return getMp3(setup.path + "/audio.mp3.json", function(arg$){
              var mp3;
              mp3 = arg$.mp3;
              return getVtt(setup.path + "/audio.vtt.json", function(vtt){
                var onStop, audio, $win, props, reader;
                onStop = function(){
                  return reader.setProps({
                    playing: false
                  });
                };
                audio = Audio(data, vtt, mp3, function(){
                  return reader.setProps({
                    loading: false
                  });
                }, function(){
                  return reader.setProps({
                    playing: true
                  });
                }, function(){
                  var page;
                  onStop();
                  if (reader.props.autoplay) {
                    page = reader.state.page + 1;
                    reader.page(page);
                    return setTimeout(function(){
                      return audio.play(page);
                    }, 750);
                  }
                }, onStop);
                $win = $(window);
                props = {
                  masterPage: mp,
                  data: data,
                  segs: segs,
                  vtt: vtt,
                  autoplay: false,
                  loading: true,
                  playing: false,
                  currentTime: function(){
                    return audio.time();
                  },
                  dpcm: dots.state.x,
                  width: $win.width(),
                  height: $win.height(),
                  onNotify: function(it){
                    var x$, y$;
                    switch (it.action) {
                    case 'mode':
                      switch (it.data) {
                      case 'glossary':
                        return console.log('should jump to the glossary page');
                      case 'read-to-me':
                        console.log('autoplay: on');
                        x$ = reader;
                        x$.setProps({
                          autoplay: true
                        });
                        x$.page(1);
                        return audio.play(1);
                      case 'learn-by-myself':
                        console.log('autoplay off');
                        y$ = reader;
                        y$.setProps({
                          autoplay: false
                        });
                        y$.page(1);
                        return y$;
                      }
                      break;
                    default:
                      return audio.process(it);
                    }
                  }
                };
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
  });
}).call(this);
