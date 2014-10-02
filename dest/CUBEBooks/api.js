(function(){
  var request, Buffer, remote, getBase64, getJson, CubeList, Cube, getCube, getCubeList, Talks, API;
  request = require('request');
  Buffer = require('buffer');
  Buffer = Buffer.Buffer || Buffer;
  remote = 'https://apis-beta.chinesecubes.com/CubeTalks';
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
      return remote + "/sentencesound/" + this.id + ".mp3";
    };
    prototype.getSoundDataURI = function(done){
      getBase64(this.soundURI(), function(err, data){
        if (err) {
          return done(err);
        } else {
          return done(err, "data:audio/mp3;base64," + data);
        }
      });
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
      return remote + "/cubesound/" + this.id + ".mp3";
    };
    prototype.strokeURI = function(){
      return remote + "/cubestroke/" + this.id;
    };
    prototype.getSoundDataURI = function(done){
      getBase64(this.soundURI(), function(err, data){
        if (err) {
          return done(err);
        } else {
          return done(err, "data:audio/mp3;base64," + data);
        }
      });
    };
    prototype.getStrokeDataURI = function(done){
      getBase64(this.strokeURI(), function(err, data){
        if (err) {
          return done(err);
        } else {
          return done(err, "data:image/gif;base64," + data);
        }
      });
    };
    return Cube;
  }(CubeList));
  getCube = function(str, done){
    getJson(remote + "/getcube/" + encodeURIComponent(str), function(err, data){
      if (err) {
        return done(err);
      } else {
        return done(err, Cube(data));
      }
    });
  };
  getCubeList = function(str, done){
    getJson(remote + "/sentence/" + encodeURIComponent(str), function(err, data){
      if (err) {
        return done(err);
      } else {
        return done(err, CubeList(data));
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
        return getJson(remote + "/recommend/" + encodeURIComponent(str), done);
      }
    }
  };
  API = {
    Talks: Talks
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
