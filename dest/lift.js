(function(){
  var ref$, Promise, all, lift, slice$ = [].slice;
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
  module.exports = lift;
}).call(this);
