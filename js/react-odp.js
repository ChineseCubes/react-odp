(function(){
  var isArray, isString, isPlainObject, slice, utils, ref$, div, NullMixin, toUpperCamel, ODPElementMixin, defaultComponents, ODP, this$ = this;
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
  import$((ref$ = this.ODP) != null
    ? ref$
    : this.ODP = {}, utils);
  div = React.DOM.div;
  NullMixin = {
    render: function(){
      return div();
    }
  };
  toUpperCamel = function(it){
    return it.split('-').map(function(it){
      return it.slice(0, 1).toUpperCase() + "" + it.slice(1);
    }).join('');
  };
  ODPElementMixin = {
    getDefaultProps: function(){
      return {
        value: {},
        children: []
      };
    },
    render: function(){
      var children, res$, i$, v;
      res$ = [];
      for (i$ in this.props.children) {
        res$.push((fn$.call(this, i$, this.props.children[i$])));
      }
      children = res$;
      v = this.props.value;
      return div({
        className: "element " + (this.state.name || 'unknown'),
        style: {
          left: v.x,
          top: v.y,
          width: v.width,
          height: v.height
        }
      }, children);
      function fn$(i, child){
        var comp;
        comp = defaultComponents[toUpperCamel(child.name)];
        if (comp) {
          return comp({
            key: i,
            value: child.value,
            children: child.children
          });
        } else {
          return null;
        }
      }
    }
  };
  defaultComponents = {
    Page: React.createClass({
      displayName: 'ReactODP.Page',
      mixins: [ODPElementMixin],
      getInitialState: function(){
        return {
          name: 'page'
        };
      }
    }),
    Frame: React.createClass({
      displayName: 'ReactODP.Frame',
      mixins: [ODPElementMixin],
      getInitialState: function(){
        return {
          name: 'frame'
        };
      }
    })
  };
  ODP = {
    Viewer: React.createClass({
      displayName: 'ReactODP.Viewer',
      mixins: [ODPElementMixin],
      getInitialState: function(){
        return {
          name: 'react-odp-viewer'
        };
      }
    })
  };
  import$((ref$ = this.ODP) != null
    ? ref$
    : this.ODP = {}, ODP);
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
