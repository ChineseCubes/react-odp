(function(){
  var request, ref$, id, filter, unslash, tagless, splitNamespace, camelFromHyphenated, notoName, slice, get, Data;
  request = require('request');
  ref$ = require('prelude-ls'), id = ref$.id, filter = ref$.filter;
  ref$ = require('./utils'), unslash = ref$.unslash, tagless = ref$.strip, splitNamespace = ref$.splitNamespace, camelFromHyphenated = ref$.camelFromHyphenated, notoName = ref$.notoName;
  slice = Array.prototype.slice;
  get = function(uri, done){
    return request({
      method: 'GET',
      uri: uri
    }, function(err, res, body){
      switch (false) {
      case !err:
        return done(err);
      case res.statusCode === 200:
        return done(new Error("not OK: " + res.statusCode));
      default:
        return done(err, body);
      }
    });
  };
  Data = {
    getMasterPage: function(path, done){
      path = unslash(path);
      return get(path + "/masterpage.json", function(err, data){
        return done(Data.patchMasterPage(JSON.parse(data), path));
      });
    },
    patchMasterPage: function(mp, path){
      var attrs, width, height, orientation, ratio;
      attrs = mp.attrs;
      width = parseInt(attrs['FO:PAGE-WIDTH'], 10);
      height = parseInt(attrs['FO:PAGE-HEIGHT'], 10);
      orientation = attrs['STYLE:PRINT-ORIENTATION'];
      ratio = orientation === 'landscape'
        ? width / height
        : height / width;
      mp.setup = {
        path: path,
        ratio: ratio,
        x: 0,
        y: 0,
        width: width,
        height: height,
        totalPages: attrs['TOTAL-PAGES']
      };
      return mp;
    },
    getPresentation: function(path, pages, done){
      var children, counter, gotOne, i$, len$, results$ = [];
      children = [];
      counter = 0;
      gotOne = function(data, i){
        children[i] = data;
        counter += 1;
        if (counter === pages.length) {
          return done({
            name: 'presentation',
            namespace: 'office',
            attrs: {
              style: {
                left: 0,
                top: 0,
                width: '28cm',
                height: '21cm'
              }
            },
            children: filter(id)(
            children)
          });
        }
      };
      for (i$ = 0, len$ = pages.length; i$ < len$; ++i$) {
        results$.push((fn$.call(this, pages[i$])));
      }
      return results$;
      function fn$(i){
        return get(path + "/page" + i + ".json", function(err, data){
          return gotOne(JSON.parse(data), i - 1);
        });
      }
    }
  };
  module.exports = Data;
}).call(this);
