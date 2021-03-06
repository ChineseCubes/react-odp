(function(){
  var request, Buffer, remoteTalks, remoteBooks, getBase64, getJson, CubeList, Cube, Book, getCube, getCubeList, getBookList, Talks, Books, API;
  request = require('request');
  Buffer = require('buffer');
  Buffer = Buffer.Buffer || Buffer;
  remoteTalks = 'https://apis-beta.chinesecubes.com/static/CubeTalks';
  remoteBooks = 'https://apis-beta.chinesecubes.com/static/CubeBooks';
  getBase64 = function(path, done){
    request(path, function(err, res, body){
      if (err) {
        return done(err);
      } else {
        return done(err, new Buffer(body).toString('base64'));
      }
    });
  };
  getJson = function(path, done){
    request(path, function(err, res, body){
      if (err) {
        return done(err);
      } else {
        return done(err, JSON.parse(body));
      }
    });
  };
  CubeList = (function(){
    CubeList.displayName = 'CubeList';
    var prototype = CubeList.prototype, constructor = CubeList;
    function CubeList(arg$){
      var it, this$ = this instanceof ctor$ ? this : new ctor$;
      it = arg$[0];
      import$(this$, it);
      return this$;
    } function ctor$(){} ctor$.prototype = prototype;
    prototype.soundURI = function(){
      return remoteTalks + "/sentencesound/" + this.id + ".mp3";
    };
    return CubeList;
  }());
  Cube = (function(superclass){
    var prototype = extend$((import$(Cube, superclass).displayName = 'Cube', Cube), superclass).prototype, constructor = Cube;
    function Cube(it){
      var this$ = this instanceof ctor$ ? this : new ctor$;
      Cube.superclass.call(this$, it);
      return this$;
    } function ctor$(){} ctor$.prototype = prototype;
    prototype.soundURI = function(){
      return remoteTalks + "/cubesound/" + this.id + ".mp3";
    };
    prototype.strokeURI = function(){
      return {
        'zh-TW': remoteTalks + "/cubestroke/" + this.id,
        'zh-CN': remoteTalks + "/cubestroke/" + this.id + "/chs"
      };
    };
    return Cube;
  }(CubeList));
  Book = (function(){
    Book.displayName = 'Book';
    var prototype = Book.prototype, constructor = Book;
    function Book(it){
      var this$ = this instanceof ctor$ ? this : new ctor$;
      import$(this$, it);
      return this$;
    } function ctor$(){} ctor$.prototype = prototype;
    prototype.getDetails = function(done){
      getJson(remoteBooks + "/books/" + this.id, function(err, data){
        if (err) {
          return done(err);
        } else {
          return done(err, import$(this, data));
        }
      });
    };
    return Book;
  }());
  getCube = function(str, done){
    getJson(remoteTalks + "/getcube/" + encodeURIComponent(str), function(err, data){
      if (err) {
        return done(err);
      } else {
        return done(err, Cube(data));
      }
    });
  };
  getCubeList = function(str, done){
    getJson(remoteTalks + "/sentence/" + encodeURIComponent(str), function(err, data){
      if (err) {
        return done(err);
      } else {
        return done(err, CubeList(data));
      }
    });
  };
  getBookList = function(str, done){
    getJson(remoteBooks + "/booklist/" + encodeURIComponent(str), function(err, data){
      var d;
      if (err) {
        return done(err);
      } else {
        return done(err, (function(){
          var i$, ref$, len$, results$ = [];
          for (i$ = 0, len$ = (ref$ = data).length; i$ < len$; ++i$) {
            d = ref$[i$];
            results$.push(Book(d));
          }
          return results$;
        }()));
      }
    });
  };
  Talks = {
    get: function(str, done){
      switch (false) {
      case !!str.length:
        return done(new Error('too short'));
      case str.length !== 1:
        return getCube(str, done);
      default:
        return getCubeList(str, done);
      }
    },
    recommend: function(str, done){
      switch (false) {
      case !(!str.length || str.length === 1):
        return done(new Error('too short'));
      default:
        return getJson(remoteTalks + "/recommend/" + encodeURIComponent(str), done);
      }
    }
  };
  Books = {
    get: function(str, done){
      switch (false) {
      case str.length !== undefined:
        return done(new Error('not a string'));
      default:
        return getBookList(str, done);
      }
    }
  };
  API = {
    Talks: Talks,
    Books: Books
  };
  module.exports = API;
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
  function extend$(sub, sup){
    function fun(){} fun.prototype = (sub.superclass = sup).prototype;
    (sub.prototype = new fun).constructor = sub;
    if (typeof sup.extended == 'function') sup.extended(sub);
    return sub;
  }
}).call(this);
