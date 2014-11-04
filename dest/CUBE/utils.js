(function(){
  var sayIt, unslash, strip, splitNamespace, camelFromHyphenated, onClick, notoName;
  sayIt = function(text, lang){
    lang == null && (lang = 'en-US');
    setTimeout(function(){
      var syn, utt, x$, u;
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
      if (!(syn && utt)) {
        return;
      }
      x$ = u = new utt(text);
      x$.lang = lang;
      x$.volume = 1.0;
      x$.rate = 1.0;
      return syn.speak(u);
    }, 0);
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
  onClick = (function(){
    try {
      return 'ontouchstart' in window;
    } catch (e$) {}
  }()) ? 'onTouchStart' : 'onClick';
  notoName = function(it){
    return it.replace(/Noto Sans ([S|T]) Chinese\s?(\w+)?/g, function(arg$, form, style){
      return "NotoSansHan" + form.toLowerCase() + (style ? "-" + style : '');
    });
  };
  module.exports = {
    sayIt: sayIt,
    unslash: unslash,
    strip: strip,
    splitNamespace: splitNamespace,
    camelFromHyphenated: camelFromHyphenated,
    onClick: onClick,
    notoName: notoName
  };
}).call(this);
