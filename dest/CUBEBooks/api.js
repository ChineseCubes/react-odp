(function(){
  var request, remote, get, getJson, CubeList, Cube, getCube, getCubeList, Talks, API;
  request = require('request');
  remote = 'https://apis-beta.chinesecubes.com/CubeTalks';
  get = function(path, done){
    request({
      method: 'GET',
      encoding: null,
      uri: path
    }, function(err, res, body){
      if (err) {
        return done(err);
      } else {
        return done(err, body);
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
    prototype.getSound = function(done){
      get(remote + "/sentencesound/" + this.id, done);
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
    prototype.getSound = function(done){
      get(remote + "/cubesound/" + this.id, done);
    };
    prototype.getStroke = function(done){
      get(remote + "/cubestroke/" + this.id, done);
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
