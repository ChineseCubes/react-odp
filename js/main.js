(function(){
  var config, resize, dots, dpcm, audio, stroke, settingsButton;
  config = {
    pageSetup: {
      ratio: 4 / 3,
      x: 0,
      y: 0,
      width: 28,
      height: 21,
      pageNumber: 8
    },
    path: './demo'
  };
  resize = function(dpcm){
    var ratio, pxWidth, pxHeight, width, height;
    ratio = config.pageSetup.ratio;
    pxWidth = config.pageSetup.width * dpcm;
    pxHeight = config.pageSetup.height * dpcm;
    width = $(window).width();
    height = $(window).height();
    if (width / ratio < height) {
      return width / pxWidth;
    } else {
      return height / pxHeight;
    }
  };
  dots = React.renderComponent(DotsDetector({
    unit: 'cm'
  }), $('#detector').get()[0]);
  dpcm = dots.state.x;
  console.log("dpcm: " + dpcm);
  audio = $('audio').get()[0];
  stroke = function(it){
    var ss;
    ss = new zhStrokeData.SpriteStroker(it, {
      url: '../../strokes/'
    });
    console.log(ss, ss.sprite);
    $('#strokes').empty().append(ss.domElement);
    return ss.play();
  };
  settingsButton = React.renderComponent(CUBEBooks.SettingsButton(), $('#settings').get()[0]);
  Data.getPresentation(config.path, config.pageSetup.pageNumber, function(data){
    var viewer;
    Data.buildSyntaxTreeFromNotes(data);
    viewer = React.renderComponent(ODP.components.presentation({
      scale: resize(dpcm),
      data: data
      /**/,
      renderProps: function(props){
        var data, attrs, text;
        data = props.data;
        attrs = data.attrs;
        switch (false) {
        case !(data.name === 'image' && attrs.name === 'activity'):
          delete attrs.href;
          delete attrs.onClick;
          return ODP.components.image(props, CUBEBooks.AudioControl({
            element: audio
          }));
        case !(data.name === 'span' && data.text):
          text = props.data.text;
          delete props.data.text;
          attrs.onClick = function(){
            return Data.getSegmentations(text, function(seg){
              var sentence;
              sentence = React.renderComponent(CUBEBooks.Sentence({
                data: seg
              }), $('#control > .content').get()[0]);
              settingsButton.setProps({
                onClick: sentence.toggleSettings
              });
              $('#control').modal('show');
              return stroke(text.replace(/，|。|？/g, function(){
                return '';
              }));
            });
          };
          return ODP.components.span(props, ReactVTT.IsolatedCue({
            target: config.path + "/demo.vtt",
            match: text,
            currentTime: function(){
              return audio.currentTime;
            }
          }));
        default:
          return ODP.renderProps(props);
        }
      }
      /**/
    }), $('#wrap').get()[0]);
    return $(window).resize(function(){
      return viewer.setProps({
        scale: resize(dpcm)
      });
    });
  });
}).call(this);
