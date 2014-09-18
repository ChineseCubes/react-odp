React        = require 'react'
DotsDetector = require './react-dots-detector'
Data         = require './CUBEBooks/data'
Book         = require './book'

<- window.requestAnimationFrame
<- $
# dots per cm
dots = React.renderComponent do
  DotsDetector unit: \cm
  $ \#detector .get!0
# read book data
{setup}:mp <- Data.getMasterPage './LRRH/'
data <- Data.getPresentation mp
segs <- Data.Segmentations data, setup.path
#vtt  <- ReactVTT.parse "#{setup.path}/audio.vtt"

React.renderComponent do
  Book do
    master-page: mp
    data: data
    segs: segs
    #vtt: vtt
    dpcm: dots.state.x
  $ \#wrap .get!0

