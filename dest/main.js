(function(){
  var React, DotsDetector, Data, Book, Reader, ReactVTT, request, getMp3, getVtt, textsFromData;
  React = require('react');
  DotsDetector = React.createFactory(require('./react-dots-detector'));
  Data = require('./CUBE/data');
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
  textsFromData = function(data){
    var texts, i$, ref$, len$, child, page, j$, ref1$, len1$, k$, ref2$, len2$, l$, ref3$, len3$, m$, ref4$, len4$;
    texts = [];
    for (i$ = 0, len$ = (ref$ = data.children).length; i$ < len$; ++i$) {
      child = ref$[i$];
      if (child.name === 'page') {
        page = [];
        for (j$ = 0, len1$ = (ref1$ = child.children).length; j$ < len1$; ++j$) {
          child = ref1$[j$];
          if (child.name === 'frame') {
            for (k$ = 0, len2$ = (ref2$ = child.children).length; k$ < len2$; ++k$) {
              child = ref2$[k$];
              if (child.name === 'text-box') {
                for (l$ = 0, len3$ = (ref3$ = child.children).length; l$ < len3$; ++l$) {
                  child = ref3$[l$];
                  if (child.name === 'p') {
                    for (m$ = 0, len4$ = (ref4$ = child.children).length; m$ < len4$; ++m$) {
                      child = ref4$[m$];
                      if (child.name === 'span' && child.text) {
                        page.push(child.text);
                      }
                    }
                  }
                }
              }
            }
          }
        }
        texts.push(page);
      }
    }
    return texts;
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
                var texts, audio, sprites, i, ref$, cue, bgn, end, currentText, play, currentTime, $win, props, reader, onStop, x$;
                texts = textsFromData(data);
                audio = (function(){
                  try {
                    Howler.iOSAutoEnable = false;
                    return new Howl({
                      urls: [mp3 || setup.path + "/audio.mp3"]
                    });
                  } catch (e$) {}
                }());
                sprites = {};
                for (i in ref$ = vtt.cues) {
                  cue = ref$[i];
                  bgn = cue.startTime;
                  end = cue.endTime;
                  sprites[cue.text] = [bgn * 1000, (end - bgn) * 1000];
                }
                audio.sprite(sprites);
                currentText = '';
                play = function(pageNum){
                  var count, ts;
                  count = 0;
                  ts = texts[pageNum];
                  currentText = ts[count];
                  return (function read(){
                    var onEnd, x$;
                    onEnd = function(){
                      if (++count < ts.length) {
                        currentText = ts[count];
                        return setTimeout(read, 750);
                      } else {
                        return currentText = '';
                      }
                    };
                    x$ = audio;
                    x$.stop(currentText);
                    x$.play(currentText);
                    x$.on('end', onEnd);
                    x$.on('pause', function(){
                      return audio.off('end', onEnd);
                    });
                    return x$;
                  }.call(this));
                };
                currentTime = function(){
                  var ref$;
                  return (((ref$ = sprites[currentText]) != null ? ref$[0] : void 8) || 0) / 1000 + ((audio != null ? audio.pos() : void 8) || 0);
                };
                $win = $(window);
                props = {
                  masterPage: mp,
                  data: data,
                  segs: segs,
                  vtt: vtt,
                  loading: true,
                  playing: false,
                  currentTime: currentTime,
                  dpcm: dots.state.x,
                  width: $win.width(),
                  height: $win.height(),
                  onNotify: function(it){
                    switch (it.action) {
                    case 'play':
                      return play(it.pageNum);
                    case 'stop':
                      return audio.pause();
                    default:
                      return console.warn("unknown notification: " + it);
                    }
                  }
                };
                if (/([1-9]\d*)/.exec(location.search) || /page([1-9]\d*)/.exec(location.href)) {
                  props.pages = [RegExp.$1];
                }
                reader = React.render(Reader(props), $('#app').get()[0]);
                $win.resize(function(){
                  return reader.setProps({
                    width: $win.width(),
                    height: $win.height()
                  });
                });
                onStop = function(){
                  return reader.setProps({
                    playing: false
                  });
                };
                x$ = audio;
                x$.on('load', function(){
                  return reader.setProps({
                    loading: false
                  });
                });
                x$.on('play', function(){
                  return reader.setProps({
                    playing: true
                  });
                });
                x$.on('end', onStop);
                x$.on('pause', onStop);
                return x$;
              });
            });
          });
        });
      });
    });
  });
}).call(this);
