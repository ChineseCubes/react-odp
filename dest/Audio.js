(function(){
  var texts, audio, sprites, i, ref$, cue, bgn, end, currentText, play, currentTime;
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
}).call(this);
