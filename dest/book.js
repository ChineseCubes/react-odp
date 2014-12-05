(function(){
  var React, ReactVTT, ODP, Button, CustomShape, Book, NotifyMixin, IsolatedCue, AudioControl, Playground, ref$, div, i, small, onClick, Howler, Howl, win;
  React = require('react');
  ReactVTT = require('react-vtt');
  ODP = require('./ODP');
  Button = React.createFactory(require('./CUBE/UI/Button'));
  CustomShape = React.createFactory(require('./CUBE/CustomShape'));
  Book = require('./CUBE/Book');
  NotifyMixin = require('./CUBE/NotifyMixin');
  IsolatedCue = React.createFactory(ReactVTT.IsolatedCue);
  AudioControl = React.createFactory(Book.AudioControl);
  Playground = React.createFactory(Book.Playground);
  ref$ = React.DOM, div = ref$.div, i = ref$.i, small = ref$.small;
  onClick = require('./CUBE/utils').onClick;
  ref$ = require('howler'), Howler = ref$.Howler, Howl = ref$.Howl;
  win = (function(){
    try {
      return window;
    } catch (e$) {}
  }());
  Book = React.createClass({
    displayName: 'CUBE.Book',
    mixins: [NotifyMixin],
    getDefaultProps: function(){
      return {
        masterPage: null,
        data: null,
        segs: null,
        vtt: null,
        loading: true,
        playing: false,
        currentTime: function(){},
        pages: null,
        dpcm: 37.79527,
        width: 1024,
        height: 768
      };
    },
    getInitialState: function(){
      return {
        scale: this.resize(this.props.dpcm, this.props.width, this.props.height),
        text: '',
        pageNumber: 0,
        showText: true
      };
    },
    componentWillUpdate: function(props, state){
      return state.scale = this.resize(props.dpcm, props.width, props.height);
    },
    resize: function(dpcm, width, height){
      var $window, setup, ratio, pxWidth, pxHeight;
      if (!win) {
        return 0.98;
      }
      $window = $(win);
      setup = this.props.masterPage.setup;
      ratio = setup.ratio;
      pxWidth = setup.width * this.props.dpcm;
      pxHeight = setup.height * this.props.dpcm;
      if (width / ratio < height) {
        return width / pxWidth;
      } else {
        return height / pxHeight;
      }
    },
    render: function(){
      var setup, counter, attrs, offsetX, ref$, this$ = this;
      setup = this.props.masterPage.setup;
      counter = 0;
      attrs = this.props.data.attrs;
      offsetX = "-" + this.state.pageNumber * +attrs.width.replace('cm', '') + "cm";
      return div({
        className: 'main'
      }, div({
        ref: 'modal',
        className: 'modal hidden'
      }, div({
        className: 'header'
      }, Button((ref$ = {
        className: 'settings'
      }, ref$[onClick + ""] = function(){
        return this$.refs.playground.toggleSettings();
      }, ref$), 'Settings'), 'C', small(null, 'UBE'), 'Control'), div({
        className: 'content'
      }, Playground({
        ref: 'playground',
        data: this.props.segs.get(this.state.text)
      }))), ODP.components.presentation({
        ref: 'presentation',
        scale: this.state.scale,
        data: this.props.data,
        renderProps: function(props){
          var click, pages, parents, data, attrs, key$, comp, text, hide, show, page, x$;
          click = onClick === 'onClick' ? 'click' : 'touchstart';
          if (!this$.props.pages) {
            this$.props.pages = (function(){
              var i$, to$, results$ = [];
              for (i$ = 1, to$ = setup.totalPages; i$ <= to$; ++i$) {
                results$.push(i$);
              }
              return results$;
            }());
          }
          pages = this$.props.pages.map(function(it){
            return "page" + it;
          });
          parents = props.parents;
          data = props.data;
          attrs = data.attrs;
          switch (false) {
          case data.name !== 'page':
            attrs.x = offsetX;
            this$[key$ = attrs.name] == null && (this$[key$] = {
              go: function(){
                return this$.setState({
                  pageNumber: +attrs.name.replace('page', '') - 1
                });
              },
              speak: function(){
                throw Error('unimplemented');
              },
              sentences: [],
              playgrounds: []
            });
            if (in$(attrs.name, pages)) {
              return ODP.renderProps(props);
            }
            break;
          case !(data.name === 'image' && attrs.name === 'activity'):
            delete attrs.href;
            delete attrs[onClick + ""];
            comp = (function(counter){
              var ref$, this$ = this;
              if (counter !== 0) {
                return ODP.components.image(props, AudioControl((ref$ = {
                  loading: this.props.loading,
                  playing: this.props.playing
                }, ref$[onClick + ""] = function(){
                  return this$.notify(!this$.props.playing
                    ? {
                      action: 'play',
                      pageNum: counter
                    }
                    : {
                      action: 'stop'
                    });
                }, ref$)));
              }
            }.call(this$, counter));
            ++counter;
            return comp;
          case !(data.name === 'span' && data.text):
            text = props.data.text;
            hide = function(){
              $('.office.presentation').css('opacity', 1);
              $(this$.refs.modal.getDOMNode()).fadeOut('fast').toggleClass('hidden', true);
              return this$.setState({
                showText: true
              });
            };
            show = function(){
              var modal, $modal, height, $top, hideOnce;
              this$.setState({
                text: text
              });
              this$.setState({
                showText: false
              });
              modal = this$.refs.modal.getDOMNode();
              $modal = $(modal);
              height = $modal.height();
              $('.office.presentation').css('opacity', 0.5);
              $modal.fadeIn('fast').toggleClass('hidden', false);
              $top = $((function(){
                try {
                  return window;
                } catch (e$) {}
              }()));
              hideOnce = function(it){
                if (!$.contains(modal, it.target)) {
                  hide();
                  return $top.off(click, hideOnce);
                }
              };
              return setTimeout(function(){
                return $top.on(click, hideOnce);
              }, 0);
            };
            page = this$[parents[1].name];
            if (!in$(text, page.sentences)) {
              x$ = page;
              x$.sentences.push(text);
              x$.playgrounds.push({
                toggle: function(it){
                  if (it) {
                    return show();
                  } else {
                    return hide();
                  }
                }
              });
            }
            attrs[onClick + ""] = show;
            if (!this$.state.showText) {
              attrs.style.display = 'none';
            }
            if (this$.props.vtt) {
              delete props.data.text;
              return ODP.components.span(props, IsolatedCue({
                target: setup.path + "/audio.vtt.json",
                match: text,
                currentTime: this$.props.currentTime
              }));
            } else {
              return ODP.renderProps(props);
            }
            break;
          case data.name !== 'custom-shape':
            if (this$.state.showText) {
              return CustomShape(props);
            }
            break;
          case data.id !== 'read-to-me':
            return Button({
              className: 'read-to-me',
              style: {
                width: ODP.scaleLength(props.scale, data.attrs.width),
                height: ODP.scaleLength(props.scale, data.attrs.height),
                left: ODP.scaleLength(props.scale, data.attrs.x),
                top: ODP.scaleLength(props.scale, data.attrs.y)
              },
              onClick: function(){
                return this.notify('read-to-me');
              }
            }, '聽讀');
          case data.id !== 'learn-by-myself':
            return Button({
              className: 'learn-by-myself',
              style: {
                width: ODP.scaleLength(props.scale, data.attrs.width),
                height: ODP.scaleLength(props.scale, data.attrs.height),
                left: ODP.scaleLength(props.scale, data.attrs.x),
                top: ODP.scaleLength(props.scale, data.attrs.y)
              },
              onClick: function(){
                return this.notify('learn-by-myself');
              }
            }, '學習');
          default:
            return ODP.renderProps(props);
          }
        }
      }));
    }
  });
  module.exports = Book;
  function in$(x, xs){
    var i = -1, l = xs.length >>> 0;
    while (++i < l) if (x === xs[i]) return true;
    return false;
  }
}).call(this);
