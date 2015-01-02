(function(){
  var $;
  $ = require('jquery');
  module.exports = function(){
    console.log(navigator.epubReadingSystem);
    $(document).keyup(function(e){
      return console.log(e);
    });
  };
}).call(this);
