(function(){
  var sayIt, unslash, strip, splitNamespace, camelFromHyphenated;
  sayIt = function(text, lang){
    var syn, utt, x$, u;
    lang == null && (lang = 'en-US');
    syn = (function(){
      try {
        return window.speechSynthesis;
      } catch (e$) {}
    }());
    utt = (function(){
      try {
        return window.SpeechSynthesisUtterance;
      } catch (e$) {}
    }());
    if (!syn || !utt) {
      return;
    }
    x$ = u = new utt(text);
    x$.lang = lang;
    x$.volume = 1.0;
    x$.rate = 1.0;
    return syn.speak(u);
  };
  unslash = function(it){
    return it.replace(/\/$/, '') + "";
  };
  strip = function(it){
    return it.replace(/<.*?>/g, function(){
      return '';
    });
  };
  splitNamespace = function(it){
    var r;
    r = it.toLowerCase().split(':').reverse();
    return {
      namespace: r[1],
      name: r[0]
    };
  };
  camelFromHyphenated = function(it){
    return it.split('-').map(function(v, i){
      switch (false) {
      case i !== 0:
        return v;
      default:
        return v.slice(0, 1).toUpperCase() + "" + v.slice(1);
      }
    }).join('');
  };
  module.exports = {
    sayIt: sayIt,
    unslash: unslash,
    strip: strip,
    splitNamespace: splitNamespace,
    camelFromHyphenated: camelFromHyphenated
  };
}).call(this);
