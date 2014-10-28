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
        page: 1
      };
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
      }, Book((ref$ = this.props, ref$.ref = 'book', ref$.width = width, ref$.height = height, ref$)), div({
        className: 'navbar'
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
      }, ref$), span()), div((ref$ = {
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
      }, ref$), span()));
    }
  });
  module.exports = Reader;
}).call(this);
