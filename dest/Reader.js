(function(){
  var React, Book, ref$, div, span, onClick, Reader;
  React = require('react');
  Book = React.createFactory(require('./Book'));
  ref$ = React.DOM, div = ref$.div, span = ref$.span;
  onClick = require('./CUBE/utils').onClick;
  Reader = React.createClass({
    displayName: 'CUBE.Reader',
    getDefaultProps: function(){
      return {
        width: 1024,
        height: 768
      };
    },
    getInitialState: function(){
      return {
        page: 0
      };
    },
    componentWillMount: function(){
      var page, pageCount, this$ = this;
      page = +window.location.search.replace('?', '');
      pageCount = this.props.data.children.length;
      if (page && (0 <= page && page < pageCount)) {
        this.state.page = page;
      } else {
        history.replaceState(this.state, 'CᴜʙᴇBooks', '?0');
      }
      return window.onpopstate = function(arg$){
        var state;
        state = arg$.state;
        if (state) {
          return this$.setState(state);
        }
      };
    },
    componentWillUpdate: function(_props, _state){
      var pageCount;
      if (this.state.page !== _state.page) {
        pageCount = this.props.data.children.length;
        return _state.page = (pageCount + _state.page) % pageCount;
      }
    },
    page: function(page){
      var state;
      state = {
        page: page
      };
      history.pushState(state, 'CᴜʙᴇBooks', "?" + page);
      return this.setState(state);
    },
    render: function(){
      var setup, width, height, pageCount, ref$, this$ = this;
      setup = this.props.masterPage.setup;
      width = this.props.width / this.props.height > setup.ratio
        ? this.props.height * setup.ratio
        : this.props.width;
      height = this.props.width / this.props.height < setup.ratio
        ? this.props.width / setup.ratio
        : this.props.height;
      pageCount = this.props.data.children.length;
      return div({
        className: 'reader',
        style: {
          width: width,
          height: height
        }
      }, Book((ref$ = this.props, ref$.ref = 'book', ref$.width = width, ref$.height = height, ref$.currentPage = this.state.page, ref$)), div((ref$ = {
        className: "prev " + (this.state.page === 0 ? 'hidden' : '')
      }, ref$[onClick + ""] = function(){
        return this$.page(this$.state.page - 1);
      }, ref$), span()), div((ref$ = {
        className: "next " + (this.state.page === pageCount - 1 ? 'hidden' : '')
      }, ref$[onClick + ""] = function(){
        return this$.page(this$.state.page + 1);
      }, ref$), span()));
    }
  });
  module.exports = Reader;
}).call(this);
