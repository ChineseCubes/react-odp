(function(){
  var config, resize, dots, dpcm, audio;
  config = {
    pageSetup: {
      ratio: 4 / 3,
      x: 0,
      y: 0,
      width: 28,
      height: 21
    }
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
  Data.getPresentation('./LRRH', function(data){
    var viewer;
    Data.buildSyntaxTreeFromNotes(data);
    viewer = React.renderComponent(ODP.components.presentation({
      scale: resize(dpcm),
      data: data
      /*
      renderProps: (props) ->
        data  = props.data
        attrs = data.attrs
        switch
        | data.name is 'image' and attrs.name is 'activity'
          delete attrs.href
          delete attrs.onClick
          ODP.components.image do
            props
            CUBEBooks.AudioControl element: audio
        | data.name is 'span' and data.text
          text = props.data.text
          delete props.data.text
          attrs.onClick = ->
            seg <- Data.getSegmentations text
            React.renderComponent do
              CUBEBooks.Sentence data: seg
              $ '#control .content .sentence' .get!0
            $ '#control' .modal 'show'
          ODP.components.span do
            props
            ReactVTT.IsolatedCue do
              target: './json/demo.vtt'
              match: text
              currentTime: -> audio.current-time
        | otherwise => ODP.renderProps props
      /**/
    }), $('#wrap').get()[0]);
    return $(window).resize(function(){
      return viewer.setProps({
        scale: resize(dpcm)
      });
    });
  });
}).call(this);
