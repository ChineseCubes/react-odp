(function(){
  var isArray, isString, isPlainObject, slice, utils, ref$, div, NullMixin, components, this$ = this;
  isArray = _.isArray, isString = _.isString, isPlainObject = _.isPlainObject;
  slice = Array.prototype.slice;
  utils = {
    numberFromCM: function(it){
      if ('cm' !== it.slice(-2)) {
        throw new Error(it + " is not end with 'cm'");
      }
      return +it.slice(0, -2);
    },
    each: function(bookJson, onNode, parents){
      var oldParents, k, v, idx, obj;
      parents == null && (parents = []);
      oldParents = slice.call(parents);
      for (k in bookJson) {
        v = bookJson[k];
        parents.push(k);
        switch (false) {
        case k !== "@attributes":
          break;
        case !isString(v):
          break;
        case !isPlainObject(v):
          onNode(v, k, slice.call(oldParents));
          utils.each(v, onNode, parents);
          break;
        case !isArray(v):
          for (idx in v) {
            obj = v[idx];
            onNode(obj, k, slice.call(oldParents));
            utils.each(obj, onNode, parents);
          }
          break;
        default:
          throw new Error('ill formated JSON');
        }
        parents.pop();
      }
    },
    map: function(bookJson, onNode, parents){
      var nodes, oldParents, k, v, idx, obj;
      parents == null && (parents = []);
      nodes = [];
      oldParents = slice.call(parents);
      for (k in bookJson) {
        v = bookJson[k];
        parents.push(k);
        switch (false) {
        case k !== "@attributes":
          break;
        case !isString(v):
          break;
        case !isPlainObject(v):
          nodes.push({
            name: k,
            value: onNode(v, k, slice.call(oldParents)),
            children: utils.map(v, onNode, parents)
          });
          break;
        case !isArray(v):
          for (idx in v) {
            obj = v[idx];
            nodes.push({
              name: k,
              value: onNode(obj, k, slice.call(oldParents)),
              children: utils.map(obj, onNode, parents)
            });
          }
          break;
        default:
          throw new Error('ill formated JSON');
        }
        parents.pop();
      }
      return nodes;
    }
  };
  import$((ref$ = this.CUBEBooks) != null
    ? ref$
    : this.CUBEBooks = {}, utils);
  div = React.DOM.div;
  NullMixin = {
    render: function(){
      return div();
    }
  };
  components = {
    Page: React.createClass({
      displayName: 'CUBEBooks.Page',
      getDefaultProps: function(){
        return {
          width: 640,
          height: 480
        };
      },
      render: function(){
        var children, res$, i$;
        res$ = [];
        for (i$ in this.props.data.children) {
          res$.push((fn$.call(this, i$, this.props.data.children[i$])));
        }
        children = res$;
        return div({
          className: 'cubebooks page',
          style: {
            width: this.props.width,
            height: this.props.height
          }
        }, children);
        function fn$(i, child){
          switch (false) {
          case child.name !== 'frame':
            return components.Frame({
              key: i,
              data: child
            });
          default:
            return div({
              key: i
            });
          }
        }
      }
    }),
    Frame: React.createClass({
      displayName: 'CUBEBooks.Frame',
      render: function(){
        return div({
          className: 'cubebooks frame',
          style: {
            left: this.props.data.value.x + "%",
            top: this.props.data.value.y + "%",
            width: this.props.data.value.width + "%",
            height: this.props.data.value.height + "%"
          }
        });
      }
    })
  };
  import$((ref$ = this.CUBEBooks) != null
    ? ref$
    : this.CUBEBooks = {}, components);
  $.getJSON('./json/page1.json', function(data){
    var config, tree, page, resize;
    data = {
      page: data
    };
    config = {
      pageSetup: {
        ratio: 4 / 3,
        x: 0,
        y: 0,
        width: 28,
        height: 21
      }
    };
    tree = CUBEBooks.map(data, function(it){
      var cm, v;
      cm = CUBEBooks.numberFromCM;
      v = it['@attributes'];
      if (!v) {
        return {};
      }
      if (v.x) {
        v.x = 100 * cm(v.x) / config.pageSetup.width;
      }
      if (v.y) {
        v.y = 100 * cm(v.y) / config.pageSetup.height;
      }
      if (v.width) {
        v.width = 100 * cm(v.width) / config.pageSetup.width;
      }
      if (v.height) {
        v.height = 100 * cm(v.height) / config.pageSetup.height;
      }
      return v;
    });
    page = React.renderComponent(CUBEBooks.Page({
      data: tree[0]
    }), $('#wrap').get()[0]);
    (resize = function(){
      var ratio, width, height;
      ratio = config.pageSetup.ratio;
      width = $(window).width();
      height = $(window).height();
      if (width / ratio < height) {
        return page.setProps({
          width: width,
          height: width / ratio
        });
      } else {
        return page.setProps({
          width: height * ratio,
          height: height
        });
      }
    })();
    return $(window).resize(resize);
  });
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
