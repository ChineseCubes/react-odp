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
      offsetX = "-" + this.props.currentPage * +attrs.style.width.replace('cm', '') + "cm";
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
      }))), ODP.render(this.props.data, this.state.scale));
    }
  });
  /*
        ODP.components.office.presentation do
          ref: \presentation
          scale: @state.scale
          data:  @props.data
          renderProps: (props) ~>
            @props.pages = [1 to setup.total-pages] if not @props.pages
            pages = @props.pages.map (-> "page#it")
            parents = props.parents
            data  = props.data
            attrs = data.attrs
            switch
            | data.name is 'page'
              attrs.x = offset-x
              # expose pages
              @[attrs.name] ?=
                speak: -> ...
                sentences: []
                playgrounds: []
              ODP.renderProps props if attrs.name in pages
            #| data.name is 'image' and attrs.name is 'activity' and not @props.autoplay
            | false
              delete attrs.href
              delete attrs["#onClick"]
              ODP.components.draw.image do
                props
                AudioControl do
                  loading: @props.loading
                  playing: @props.playing
                  "#onClick": ~>
                    @notify unless @props.playing
                      then action: \play, page-num: props.data.attrs.page-num
                      else action: \stop
            | data.name is 'span' and data.text
              text = data.text
              page = @[parents.1.name]
              unless text in page.sentences
                page
                  ..sentences.push text
                  ..playgrounds.push do
                    toggle: ~> if it then @show! else @hide!
              attrs.style <<< display: \none if not @state.show-text
              startTime = 0
              endTime = 0
              if @props.vtt
                delete props.data.text
                for cue in @props.vtt?cues
                  if text is cue.text
                    { startTime, endTime } = cue
                ODP.components.text.span do
                  props
                  Cue do
                    {
                      key: text
                      startTime
                      endTime
                      current-time: @props.current-time
                    }
                    @state.comps[text]
              else
                ODP.renderProps props
            | data.name is 'custom-shape'
              CustomShape props if @state.show-text
            | data.id is 'glossary' or
              data.id is 'read-to-me' or
              data.id is 'learn-by-myself'
              Button do
                className: data.id
                style:
                  width:  ODP.scale-length props.scale, data.attrs.width
                  height: ODP.scale-length props.scale, data.attrs.height
                  left: ODP.scale-length props.scale, data.attrs.x
                  top:  ODP.scale-length props.scale, data.attrs.y
                onClick: -> @notify action: \mode data: data.id
            | otherwise => ODP.renderProps props
  */
  module.exports = Book;
  function in$(x, xs){
    var i = -1, l = xs.length >>> 0;
    while (++i < l) if (x === xs[i]) return true;
    return false;
  }
}).call(this);
