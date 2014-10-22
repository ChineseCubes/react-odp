(function(){
  var React, Book, ref$, div, span, onClick, Reader;
  React = require('react');
  Book = require('./Book');
  ref$ = React.DOM, div = ref$.div, span = ref$.span;
  onClick = require('./CUBE/utils').onClick;
  Reader = React.createClass({
    displayName: 'CUBE.Reader',
    getInitialState: function(){
      return {
        page: 1
      };
    },
    render: function(){
      var pageCount, ref$, this$ = this;
      pageCount = this.props.data.children.length;
      return div({
        className: 'reader'
      }, Book((ref$ = this.props, ref$.ref = 'book', ref$)), div({
        className: 'menu'
      }), div((ref$ = {
        className: "prev " + (this.state.page === 1 ? 'hidden' : '')
      }, ref$[onClick + ""] = function(){
        --this$.state.page;
        if (this$.state.page < 1) {
          this$.state.page = 1;
        }
        this$.refs.book["page" + this$.state.page].go();
        return this$.setState({
          page: this$.state.page
        });
      }, ref$), span({}, '上一頁')), div((ref$ = {
        className: "next " + (this.state.page === pageCount ? 'hidden' : '')
      }, ref$[onClick + ""] = function(){
        ++this$.state.page;
        if (this$.state.page > pageCount) {
          this$.state.page = pageCount;
        }
        this$.refs.book["page" + this$.state.page].go();
        return this$.setState({
          page: this$.state.page
        });
      }, ref$), span({}, '下一頁')));
    }
  });
  module.exports = Reader;
}).call(this);
