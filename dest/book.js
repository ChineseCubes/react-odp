(function(){
  var React, ReactVTT, ODP, Data, Button, CustomShape, Book, NotifyMixin, Cue, AudioControl, Playground, ref$, div, i, small, span, onClick, Howler, Howl, win;
  React = require('react');
  ReactVTT = require('react-vtt');
  ODP = require('./ODP');
  Data = require('./CUBE/data');
  Button = React.createFactory(require('./CUBE/UI/Button'));
  CustomShape = React.createFactory(require('./CUBE/CustomShape'));
  Book = require('./CUBE/Book');
  NotifyMixin = require('./CUBE/NotifyMixin');
  Cue = React.createFactory(ReactVTT.Cue);
  AudioControl = React.createFactory(Book.AudioControl);
  Playground = React.createFactory(Book.Playground);
  ref$ = React.DOM, div = ref$.div, i = ref$.i, small = ref$.small, span = ref$.span;
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
        autoplay: false,
        loading: true,
        playing: false,
        currentTime: 0,
        pages: null,
        currentPage: 0,
        dpcm: 37.79527,
        width: 1024,
        height: 768,
        text: ''
      };
    },
    getInitialState: function(){
      return {
        scale: this.resize(this.props.dpcm, this.props.width, this.props.height),
        showText: true,
        paragraphs: [],
        segments: [],
        dicts: []
      };
    },
    componentWillMount: function(){
      return this.state.comps = this.ccaComps(Data.paragraphsOf(this.props.data), Data.segmentsOf(this.props.data), Data.dictsOf(this.props.data));
    },
    componentWillUpdate: function(props, state){
      state.scale = this.resize(props.dpcm, props.width, props.height);
      if (this.props.data !== props.data) {
        state.comps = this.ccaComps(Data.paragraphsOf(props.data), Data.segmentsOf(props.data), Data.dictsOf(props.data));
      }
      if (this.props.text !== props.text) {
        if (props.text.length) {
          return this.show();
        }
      }
    },
    hide: function(){
      $('.office.presentation').css('opacity', 1);
      $(this.refs.modal.getDOMNode()).fadeOut('fast').toggleClass('hidden', true);
      this.notify({
        action: 'cca',
        text: ''
      });
      return this.setState({
        showText: true
      });
    },
    show: function(){
      var click, modal, $modal, height, $top, hideOnce, this$ = this;
      click = onClick === 'onClick' ? 'click' : 'touchstart';
      modal = this.refs.modal.getDOMNode();
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
          this$.hide();
          return $top.off(click, hideOnce);
        }
      };
      setTimeout(function(){
        return $top.on(click, hideOnce);
      }, 0);
      return this.setState({
        showText: false
      });
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
    ccaComps: function(paragraphs, segments, dicts){
      var comps, i, segs, i$, ref$, len$, sentence, children, j$, len1$;
      comps = {};
      for (i in paragraphs) {
        segs = segments[i].map(fn$);
        for (i$ = 0, len$ = (ref$ = paragraphs[i]).length; i$ < len$; ++i$) {
          sentence = ref$[i$];
          children = [];
          for (j$ = 0, len1$ = Data.segment(sentence, segs).length; j$ < len1$; ++j$) {
            (fn1$.call(this, Data.segment(sentence, segs)[j$], i, sentence));
          }
          comps[sentence] = span({}, children);
        }
      }
      return comps;
      function fn$(it){
        return it.zh;
      }
      function fn1$(seg, i, sentence){
        var this$ = this;
        if (in$(seg, segs)) {
          children.push(span({
            style: {
              cursor: 'pointer'
            },
            onClick: function(){
              return this$.notify({
                action: 'cca',
                text: seg
              });
            }
          }, seg));
        } else {
          children.push(seg);
        }
      }
    },
    render: function(){
      var setup, attrs, offsetX, ref$, this$ = this;
      setup = this.props.masterPage.setup;
      attrs = this.props.data.attrs;
      offsetX = "-" + this.props.currentPage * +attrs.width.replace('cm', '') + "cm";
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
        data: this.props.segs.get(this.props.text)
      }))), ODP.components.presentation({
        ref: 'presentation',
        scale: this.state.scale,
        data: this.props.data,
        renderProps: function(props){
          var pages, parents, data, attrs, key$, ref$, text, page, x$, startTime, endTime, i$, ref1$, len$, cue;
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
          case !false:
            delete attrs.href;
            delete attrs[onClick + ""];
            return ODP.components.image(props, AudioControl((ref$ = {
              loading: this$.props.loading,
              playing: this$.props.playing
            }, ref$[onClick + ""] = function(){
              return this$.notify(!this$.props.playing
                ? {
                  action: 'play',
                  pageNum: props.data.attrs.pageNum
                }
                : {
                  action: 'stop'
                });
            }, ref$)));
          case !(data.name === 'span' && data.text):
            text = data.text;
            page = this$[parents[1].name];
            if (!in$(text, page.sentences)) {
              x$ = page;
              x$.sentences.push(text);
              x$.playgrounds.push({
                toggle: function(it){
                  if (it) {
                    return this$.show();
                  } else {
                    return this$.hide();
                  }
                }
              });
            }
            if (!this$.state.showText) {
              attrs.style.display = 'none';
            }
            startTime = 0;
            endTime = 0;
            if (this$.props.vtt) {
              delete props.data.text;
              for (i$ = 0, len$ = (ref$ = (ref1$ = this$.props.vtt) != null ? ref1$.cues : void 8).length; i$ < len$; ++i$) {
                cue = ref$[i$];
                if (text === cue.text) {
                  startTime = cue.startTime, endTime = cue.endTime;
                }
              }
              return ODP.components.span(props, Cue({
                key: text,
                startTime: startTime,
                endTime: endTime,
                currentTime: this$.props.currentTime
              }, this$.state.comps[text]));
            } else {
              return ODP.renderProps(props);
            }
            break;
          case data.name !== 'custom-shape':
            if (this$.state.showText) {
              return CustomShape(props);
            }
            break;
          case !(data.id === 'glossary' || data.id === 'read-to-me' || data.id === 'learn-by-myself'):
            return Button({
              className: data.id,
              style: {
                width: ODP.scaleLength(props.scale, data.attrs.width),
                height: ODP.scaleLength(props.scale, data.attrs.height),
                left: ODP.scaleLength(props.scale, data.attrs.x),
                top: ODP.scaleLength(props.scale, data.attrs.y)
              },
              onClick: function(){
                return this.notify({
                  action: 'mode',
                  data: data.id
                });
              }
            });
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
