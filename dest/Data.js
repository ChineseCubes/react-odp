(function(){
  var ref$, id, filter, lift, get, getJson, slice, getMaster, patchMaster, wrapPresentation, patchPage;
  ref$ = require('prelude-ls'), id = ref$.id, filter = ref$.filter;
  ref$ = require('./async'), lift = ref$.lift, get = ref$.get, getJson = ref$.getJson;
  slice = Array.prototype.slice;
  getMaster = lift(function(uri){
    return patchMaster(getJson(uri + "/masterpage.json"));
  });
  patchMaster = lift(function(master){
    var attrs, width, height, orientation, ratio;
    attrs = master.attrs;
    width = parseInt(attrs['FO:PAGE-WIDTH'], 10);
    height = parseInt(attrs['FO:PAGE-HEIGHT'], 10);
    orientation = attrs['STYLE:PRINT-ORIENTATION'];
    ratio = orientation === 'landscape'
      ? width / height
      : height / width;
    master.setup = {
      ratio: ratio,
      x: 0,
      y: 0,
      width: width,
      height: height,
      totalPages: +attrs['TOTAL-PAGES']
    };
    return master;
  });
  wrapPresentation = lift(function(pages){
    return {
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
      pages)
    };
  });
  patchPage = lift(function(page, oldOne, newOne){
    var data;
    data = JSON.stringify(page);
    return JSON.parse(data.replace(oldOne, newOne));
  });
  module.exports = {
    getMaster: getMaster,
    wrapPresentation: wrapPresentation,
    patchPage: patchPage
  };
}).call(this);
