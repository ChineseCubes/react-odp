(function(){
  var textsFromPresentation, Audio;
  textsFromPresentation = function(p){
    var texts, i$, ref$, len$, child, page, j$, ref1$, len1$, k$, ref2$, len2$, l$, ref3$, len3$, m$, ref4$, len4$;
    texts = [];
    for (i$ = 0, len$ = (ref$ = p.children).length; i$ < len$; ++i$) {
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
  Audio = (function(){
    Audio.displayName = 'Audio';
    var prototype = Audio.prototype, constructor = Audio;
    function Audio(presentation, vtt, mp3, onLoad, onPlay, onEnd, onPause, onUpdate){
      var x$, i, ref$, cue, bgn, end, this$ = this instanceof ctor$ ? this : new ctor$;
      this$.onUpdate = onUpdate;
      this$.texts = textsFromPresentation(presentation);
      this$.audio = (function(){
        try {
          Howler.iOSAutoEnable = false;
          return new Howl({
            urls: [mp3]
          });
        } catch (e$) {}
      }());
      x$ = this$.audio;
      x$.on('load', onLoad);
      x$.on('play', onPlay);
      x$.on('pause', onPause);
      this$._onEnd = onEnd;
      this$.sprites = {};
      for (i in ref$ = vtt.cues) {
        cue = ref$[i];
        bgn = cue.startTime;
        end = cue.endTime;
        this$.sprites[cue.text] = [bgn * 1000, (end - bgn) * 1000];
      }
      this$.audio.sprite(this$.sprites);
      this$.currentText = '';
      return this$;
    } function ctor$(){} ctor$.prototype = prototype;
    prototype.play = function(pageNum){
      var update, count, ts, onEnd, clean, x$, read, this$ = this;
      update = function(){
        if (typeof this$.onUpdate === 'function') {
          this$.onUpdate(this$.time());
        }
        return this$.rid = requestAnimationFrame(update);
      };
      this.rid = requestAnimationFrame(update);
      count = 0;
      ts = this.texts[pageNum];
      if (!ts) {
        return;
      }
      this.currentText = ts[count];
      onEnd = function(){
        if (++count < ts.length) {
          this$.currentText = ts[count];
          return setTimeout(read, 750);
        } else {
          this$.currentText = '';
          clean();
          return setTimeout(this$._onEnd, 0);
        }
      };
      clean = function(){
        var x$;
        x$ = this$.audio;
        x$.off('end', onEnd);
        x$.off('pause', clean);
        return x$;
      };
      x$ = this.audio;
      x$.on('end', onEnd);
      x$.on('pause', clean);
      read = function(){
        var x$;
        x$ = this$.audio;
        x$.stop(this$.currentText);
        x$.play(this$.currentText);
        return x$;
      };
      return read();
    };
    prototype.stop = function(){
      cancelAnimationFrame(this.rid);
      return this.audio.pause();
    };
    prototype.time = function(){
      var ref$;
      return (((ref$ = this.sprites[this.currentText]) != null ? ref$[0] : void 8) || 0) / 1000 + (((ref$ = this.audio) != null ? ref$.pos() : void 8) || 0);
    };
    prototype.process = function(it){
      switch (it.action) {
      case 'play':
        return this.play(it.pageNum);
      case 'stop':
        return this.stop();
      default:
        return console.warn("unknown action: " + it);
      }
    };
    return Audio;
  }());
  module.exports = Audio;
}).call(this);
