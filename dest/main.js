(function(){
  var $, React, RSVP, all, ref$, lift, getJson, getMaster, wrapPresentation, DotsDetector, Book, drawBook, getPages;
  $ = require('jquery');
  React = require('react');
  RSVP = require('rsvp'), all = RSVP.all;
  ref$ = require('./async'), lift = ref$.lift, getJson = ref$.getJson;
  ref$ = require('./Data'), getMaster = ref$.getMaster, wrapPresentation = ref$.wrapPresentation;
  DotsDetector = React.createFactory(require('./DotsDetector'));
  Book = React.createFactory(require('./Book'));
  RSVP.on('error', function(it){
    return console.error(it.stack);
  });
  drawBook = lift(function(setup, data){
    var $win, dots, dpcm, scaleToFit, book;
    $win = $((function(){
      try {
        return window;
      } catch (e$) {}
    }()));
    dots = React.render(DotsDetector({
      unit: 'cm'
    }), document.getElementById('detector'));
    dpcm = dots.state.x;
    scaleToFit = function(width, height){
      var pxWidth, pxHeight;
      if (!(width && height)) {
        return undefined;
      }
      pxWidth = setup.width * dpcm;
      pxHeight = setup.height * dpcm;
      if (width / setup.ratio < height) {
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
  getPages = lift(function(uri, setup){
    var idx;
    if (/([1-9]\d*)/.exec(location.search) || /page([1-9]\d*)/.exec(location.href)) {
      idx = +RegExp.$1;
      if (idx === 0) {
        idx = 1;
      }
      if (idx > setup.totalPages) {
        idx = setup.totalPages;
      }
    } else {
      idx = 1;
    }
    return getJson(uri + "/page" + idx + ".json").then(function(it){
      return [it];
    });
  });
  $(function(){
    return window.requestAnimationFrame(function(){
      var uri, setup, data;
      uri = 'http://localhost:8081/books/two-tigers/';
      setup = getMaster(uri).then(function(arg$){
        var setup;
        setup = arg$.setup;
        return setup;
      });
      data = wrapPresentation(getPages(uri, setup));
      return drawBook(setup, data);
    });
  });
}).call(this);
