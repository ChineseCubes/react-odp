(function(){
  var request, ref$, Promise, all, lift, get, getJson, getBin, slice$ = [].slice;
  request = require('request');
  ref$ = require('rsvp'), Promise = ref$.Promise, all = ref$.all;
  lift = function(f){
    return function(){
      var args;
      args = slice$.call(arguments);
      return all(args).then(function(it){
        return f.apply(this, it);
      });
    };
  };
  get = lift(function(uri){
    return new Promise(function(resolve, reject){
      uri = encodeURI(uri);
      return request({
        method: 'GET',
        uri: uri
      }, function(err, res, body){
        switch (false) {
        case !err:
          reject(err);
          break;
        default:
          resolve(body);
        }
      });
    });
  });
  getJson = lift(function(uri){
    return get(uri).then(function(it){
      return JSON.parse(it);
    });
  });
  getBin = lift(function(uri){
    return new Promise(function(resolve, reject){
      uri = encodeURI(uri);
      return request({
        method: 'GET',
        uri: uri,
        encoding: 'binary'
      }, function(err, res, body){
        switch (false) {
        case !err:
          reject(err);
          break;
        default:
          resolve(new Buffer(body, 'binary'));
        }
      });
    });
  });
  module.exports = {
    lift: lift,
    get: get,
    getJson: getJson,
    getBin: getBin
  };
}).call(this);
