(function(){
  var $, React, Data, DotsDetector, Book, find, bookUri;
  $ = require('jquery');
  React = require('react');
  Data = require('./Data');
  DotsDetector = React.createFactory(require('./DotsDetector'));
  Book = React.createFactory(require('./Book'));
  find = require('prelude-ls').find;
  bookUri = 'http://localhost:8081/books/two-tigers/';
  $(function(){
    return window.requestAnimationFrame(function(){
      var dots;
      React.initializeTouchEvents(true);
      dots = React.render(DotsDetector({
        unit: 'cm'
      }), document.getElementById('detector'));
      return Data.getMasterPage(bookUri, function(mp){
        var setup, page;
        setup = mp.setup;
        if (/([1-9]\d*)/.exec(location.search) || /page([1-9]\d*)/.exec(location.href)) {
          page = +RegExp.$1 + 1;
          if (page > setup.totalPages) {
            page = setup.totalPages;
          }
        } else {
          page = 1;
        }
        return Data.getPresentation(setup.path, [page], function(data){
          var $win, dpcm, scaleToFit, book;
          $win = $((function(){
            try {
              return window;
            } catch (e$) {}
          }()));
          dpcm = dots.state.x;
          scaleToFit = function(width, height){
            var ratio, pxWidth, pxHeight;
            if (!(width && height)) {
              return 1.0;
            }
            ratio = setup.ratio;
            pxWidth = setup.width * dpcm;
            pxHeight = setup.height * dpcm;
            if (width / ratio < height) {
              return width / pxWidth;
            } else {
              return height / pxHeight;
            }
          };
          book = React.render(Book({
            data: data,
            scale: scaleToFit($win.width(), $win.height())
          }), document.getElementById('app'));
          return $win.resize(function(){
            return requestAnimationFrame(function(){
              return book.setProps({
                scale: scaleToFit($win.width(), $win.height())
              });
            });
          });
        });
      });
    });
  });
}).call(this);
