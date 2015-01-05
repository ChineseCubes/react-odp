(function(){
  var React, DotsDetector, Data, Audio, Book, Reader, ReactVTT, request, ref$, select, option, find, reader, initBook, $win, host, getMp3, getVtt, BookSelector;
  React = require('react');
  DotsDetector = React.createFactory(require('./react-dots-detector'));
  Data = require('./CUBE/data');
  Audio = require('./Logic/Audio');
  Book = React.createFactory(require('./Book'));
  Reader = React.createFactory(require('./Reader'));
  ReactVTT = require('react-vtt');
  require('react-vtt/dest/Cue.css');
  request = require('request');
  require('./sandbox')();
  ref$ = React.DOM, select = ref$.select, option = ref$.option;
  find = require('lodash').find;
  $win = $(window);
  host = 'http://cnl.linode.caasih.net';
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
  BookSelector = React.createClass({
    displayName: 'BookSelector',
    getDefaultProps: function(){
      return {
        title: ''
      };
    },
    getInitialState: function(){
      return {
        books: []
      };
    },
    componentWillMount: function(){
      var this$ = this;
      return request(host + "/books/", function(err, res, body){
        var title, books, book, alias;
        title = this$.props.title;
        books = JSON.parse(body);
        book = find(books, function(it){
          return it.title === title;
        });
        alias = (book != null ? book.alias : void 8) || books[0].alias;
        initBook(reader, host + "/books/" + alias + "/", function(it){
          reader = it;
          return setTimeout(function(){
            return reader.page(0);
          }, 0);
        });
        return this$.setState({
          books: books
        });
      });
    },
    render: function(){
      var status, ref$, book, this$ = this;
      status = (ref$ = this.props.title) != null && ref$.length ? ' disabled' : '';
      return select({
        className: 'book-selector' + status,
        name: 'book-selector',
        onChange: function(it){
          var alias;
          alias = it.target.value;
          return initBook(reader, host + "/books/" + alias + "/", function(it){
            reader = it;
            return setTimeout(function(){
              return reader.page(0);
            }, 0);
          });
        }
      }, (function(){
        var i$, ref$, len$, results$ = [];
        for (i$ = 0, len$ = (ref$ = this.state.books).length; i$ < len$; ++i$) {
          book = ref$[i$];
          results$.push(option({
            key: book.id,
            value: book.alias
          }, book.title));
        }
        return results$;
      }.call(this)));
    }
  });
  BookSelector = React.createFactory(BookSelector);
  window.requestAnimationFrame(function(){
    return $(function(){
      var dots, title, selector;
      React.initializeTouchEvents(true);
      dots = React.render(DotsDetector({
        unit: 'cm'
      }), $('#detector').get()[0]);
      title = /\?(.*)\/?/.exec(location.search) ? decodeURIComponent(RegExp.$1) : void 8;
      selector = React.render(BookSelector({
        title: title
      }), $('#selector').get()[0]);
      initBook = function(reader, uri, done){
        return Data.getMasterPage(uri, function(mp){
          var setup;
          setup = mp.setup;
          return Data.getPresentation(mp, function(data){
            return Data.Segmentations(data, setup.path, function(segs){
              return getMp3(setup.path + "/audio.mp3.json", function(arg$){
                var mp3;
                mp3 = arg$.mp3;
                return getVtt(setup.path + "/audio.vtt.json", function(vtt){
                  var onStop, audio, props, reader;
                  onStop = function(){
                    return reader.setProps({
                      playing: false
                    });
                  };
                  audio = Audio(data, vtt, mp3, function(){
                    return reader.setProps({
                      loading: false
                    });
                  }, function(){
                    return reader.setProps({
                      playing: true
                    });
                  }, function(){
                    var page;
                    onStop();
                    if (reader.props.autoplay) {
                      page = reader.state.page + 1;
                      reader.page(page);
                      return setTimeout(function(){
                        return audio.play(page);
                      }, 750);
                    }
                  }, onStop, function(time){
                    return reader.setProps({
                      currentTime: time
                    });
                  });
                  props = {
                    masterPage: mp,
                    data: data,
                    segs: segs,
                    vtt: vtt,
                    autoplay: false,
                    loading: true,
                    playing: false,
                    currentTime: 0,
                    dpcm: dots.state.x,
                    width: $win.width(),
                    height: $win.height(),
                    onNotify: function(it){
                      var x$, y$;
                      switch (it.action) {
                      case 'mode':
                        switch (it.data) {
                        case 'glossary':
                          return console.log('should jump to the glossary page');
                        case 'read-to-me':
                          console.log('autoplay: on');
                          x$ = reader;
                          x$.setProps({
                            autoplay: true
                          });
                          x$.page(1);
                          return audio.play(1);
                        case 'learn-by-myself':
                          console.log('autoplay off');
                          y$ = reader;
                          y$.setProps({
                            autoplay: false
                          });
                          y$.page(1);
                          return y$;
                        }
                        break;
                      case 'cca':
                        return reader.setProps({
                          text: it.text
                        });
                      default:
                        return audio.process(it);
                      }
                    }
                  };
                  if (reader) {
                    reader.setProps(props);
                  } else {
                    reader = React.render(Reader(props), $('#app').get()[0]);
                  }
                  return done(reader);
                });
              });
            });
          });
        });
      };
      return $win.resize(function(){
        return reader.setProps({
          width: $win.width(),
          height: $win.height()
        });
      });
    });
  });
}).call(this);
