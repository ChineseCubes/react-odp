(function(){
  var React, DotsDetector, Data, Audio, Storage, Book, ReactVTT, request, getMp3, getVtt;
  React = require('react');
  DotsDetector = React.createFactory(require('./react-dots-detector'));
  Data = require('./CUBE/data');
  Audio = require('./Logic/Audio');
  Storage = require('./Logic/Storage');
  Book = React.createFactory(require('./Book'));
  ReactVTT = require('react-vtt');
  require('react-vtt/dest/Cue.css');
  request = require('request');
  require('./sandbox')();
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
              var audio, props, page, book;
              audio = Audio(data, vtt, mp3, function(){
                return book.setProps({
                  loading: false
                });
              }, function(){
                return book.setProps({
                  playing: true
                });
              }, function(){
                book.setProps({
                  playing: false
                });
                return Storage.load('autoplay').then(function(autoplay){
                  if (autoplay) {
                    return Storage.load('page').then(function(page){
                      var next;
                      next = 1 + page;
                      return Storage.save('page', next).then(function(){
                        return location.href = "page" + next + ".xhtml";
                      });
                    });
                  }
                });
              }, function(){
                book.setProps({
                  playing: false
                });
                return Storage.save('autoplay', false);
              }, function(time){
                return book.setProps({
                  currentTime: time
                });
              });
              props = {
                masterPage: mp,
                data: data,
                segs: segs,
                vtt: vtt,
                loading: true,
                playing: false,
                currentTime: 0,
                dpcm: dots.state.x,
                onNotify: function(it){
                  switch (it.action) {
                  case 'mode':
                    switch (it.data) {
                    case 'glossary':
                      return console.log('should jump to glossary');
                    case 'read-to-me':
                      return Storage.save('autoplay', true).then(function(){
                        return location.href = 'page2.xhtml';
                      });
                    case 'learn-by-myself':
                      return Storage.save('autoplay', false).then(function(){
                        return location.href = 'page2.xhtml';
                      });
                    }
                    break;
                  case 'cca':
                    if (it.text.length) {
                      Storage.save('autoplay', false);
                    }
                    return book.setProps({
                      text: it.text
                    });
                  default:
                    return audio.process(it);
                  }
                }
              };
              if (/([1-9]\d*)/.exec(location.search) || /page([1-9]\d*)/.exec(location.href)) {
                props.pages = [RegExp.$1];
                page = +RegExp.$1;
                Storage.save('page', page);
                Storage.load('autoplay').then(function(autoplay){
                  if (autoplay) {
                    return setTimeout(function(){
                      return audio.play(page - 1);
                    }, 750);
                  }
                });
              }
              return book = React.render(Book(props), document.getElementById('app'));
            });
          });
        });
      });
    });
  });
}).call(this);
