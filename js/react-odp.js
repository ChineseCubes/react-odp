(function(){
  var div, isArray, isString, isPlainObject, slice, DotsDetector, utils, ref$, isNumber, NullMixin, DrawMixin, defaultComponents, this$ = this;
  div = React.DOM.div;
  isArray = _.isArray, isString = _.isString, isPlainObject = _.isPlainObject;
  slice = Array.prototype.slice;
  DotsDetector = React.createClass({
    displayName: 'UnitDetector',
    pxFromStyle: function(it){
      var result, px;
      result = /(\d*\.?\d+)px/.exec(it);
      if (result) {
        px = result[1];
      }
      return +px;
    },
    getDefaultProps: function(){
      return {
        unit: 'in',
        scale: 1024
      };
    },
    getInitialState: function(){
      return {
        x: 96,
        y: 96
      };
    },
    componentDidMount: function(){
      var style, x$;
      style = getComputedStyle(this.refs.unit.getDOMNode());
      x$ = this.state;
      x$.x = this.pxFromStyle(style.width) / this.props.scale;
      x$.y = this.pxFromStyle(style.height) / this.props.scale;
    },
    render: function(){
      return div({
        ref: 'unit',
        style: {
          position: 'absolute',
          display: 'none',
          width: this.props.scale + "" + this.props.unit,
          height: this.props.scale + "" + this.props.unit
        }
      });
    }
  });
  utils = {
    DotsDetector: DotsDetector,
    getPageJSON: function(path, done){
      var ref$, dir;
      ref$ = /(.*\/)?.*\.json/.exec(path) || [void 8, ''], dir = ref$[1];
      $.getJSON(path, function(data){
        var tree;
        import$(data['@attributes'], {
          x: '0',
          y: '0',
          width: '28cm',
          height: '21cm'
        });
        data = {
          page: data
        };
        tree = utils.map(data, function(it){
          var r;
          r = it['@attributes'] || [];
          if (r.href) {
            r.href = dir + "" + r.href;
          }
          return r;
        });
        return done(tree);
      });
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
  isNumber = _.isNumber;
  NullMixin = {
    render: function(){
      return div();
    }
  };
  DrawMixin = {
    toHyphen: function(){},
    toUpperCamel: function(it){
      return it.split('-').map(function(it){
        return it.slice(0, 1).toUpperCase() + "" + it.slice(1);
      }).join('');
    },
    scaleStyle: function(it){
      var r;
      switch (false) {
      case !!it:
        return it;
      case !isNumber(it):
        return it * this.props.scale;
      case !/\d*\.?\d+%$/.test(it):
        return it;
      case !(r = /(\d*\.?\d+)(in|cm|mm|px|pc|pt)?$/.exec(it)):
        return +r[1] * this.props.scale + "" + (r[2] || '');
      default:
        throw new Error("style \"" + it + "\" should be a length");
      }
    },
    getDefaultProps: function(){
      return {
        scale: 1.0,
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
        className: "draw " + (this.state.name || 'unknown'),
        style: {
          left: this.scaleStyle(v.x) || 'auto',
          top: this.scaleStyle(v.y) || 'auto',
          width: this.scaleStyle(v.width) || 'auto',
          height: this.scaleStyle(v.height) || 'auto'
        }
      }, children);
      function fn$(i, child){
        var comp;
        comp = defaultComponents[this.toUpperCamel(child.name)];
        if (comp) {
          return comp({
            key: i,
            scale: this.props.scale,
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
      mixins: [DrawMixin],
      getInitialState: function(){
        return {
          name: 'page'
        };
      }
    }),
    Frame: React.createClass({
      displayName: 'ReactODP.Frame',
      mixins: [DrawMixin],
      getInitialState: function(){
        return {
          name: 'frame'
        };
      }
    }),
    Presentation: React.createClass({
      displayName: 'ReactODP.Presentation',
      mixins: [DrawMixin],
      getInitialState: function(){
        return {
          name: 'presentation'
        };
      }
    })
  };
  import$((ref$ = this.ODP) != null
    ? ref$
    : this.ODP = {}, defaultComponents);
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
