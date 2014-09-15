#!/usr/bin/env slimerjs
var page, num, url;
page = require('webpage').create();
num = phantom.args[0] || 1;
url = 'http://0.0.0.0:8888/?' + num;
page.onConsoleMessage = function(msg){
  var fs;
  fs = require('fs');
  fs.write('page' + num + '.xhtml', "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\n<html lang=\"zh-Hant\" xml:lang=\"zh-Hant\" xmlns=\"http://www.w3.org/1999/xhtml\">\n<head>\n<meta name=\"viewport\" content=\"width=1024, height=768\"/>\n<meta charset=\"utf-8\" />\n<style>\n@-viewport { width: 1024px; height: 768px; }\n.draw.frame:nth-child(4) { display: none !important }\n.draw.frame:nth-child(5) { left: 1cm !important; top: 0.5cm !important; }\n</style>\n<link rel=\"stylesheet\" type=\"text/css\" href=\"./css/reset.css\" />\n<link rel=\"stylesheet\" type=\"text/css\" href=\"./css/vendor.css\" />\n<link rel=\"stylesheet\" type=\"text/css\" href=\"./css/style.css\" />\n</head>\n" + msg + "\n</html>");
  return phantom.exit();
};
page.open(url, function(status){
  return page.evaluate(function(){
    return setTimeout(function(){
      var dom;
      dom = (new DOMParser).parseFromString(document.body.innerHTML, 'text/html');
      return console.log((new XMLSerializer).serializeToString(dom.body).replace(/></g, '>\n<'));
    }, 1000);
  });
});
