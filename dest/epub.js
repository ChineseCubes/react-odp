(function(){
  var React, DotsDetector, Data, Book, ReactVTT;
  React = require('react');
  DotsDetector = React.createFactory(require('./react-dots-detector'));
  Data = require('./CUBE/data');
  Book = React.createFactory(require('./Book'));
  ReactVTT = require('react-vtt');
  require('react-vtt/dest/ReactVTT.css');
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
          return ReactVTT.parse(setup.path + "/audio.vtt.json", function(vtt){
            var props;
            props = {
              masterPage: mp,
              data: data,
              segs: segs,
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
}).call(this);
