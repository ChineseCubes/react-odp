(function(){
  var React, Presentation, div, Book;
  React = require('react');
  Presentation = require('./Presentation');
  div = React.DOM.div;
  Book = React.createClass({
    displayName: 'Book',
    getDefaultProps: function(){
      return {
        data: null,
        scale: 1.0
      };
    },
    render: function(){
      return div({
        className: 'book'
      }, Presentation.render(this.props.data, this.props.scale));
    }
  });
  module.exports = Book;
}).call(this);
