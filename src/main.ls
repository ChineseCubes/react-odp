require! {
  jquery: $
  react: React
  rsvp: { all }:RSVP
  './async': { lift, get-json }
  './Data': { get-master, wrap-presentation }
}
DotsDetector = React.createFactory require './DotsDetector'
Book         = React.createFactory require './Book'

RSVP.on \error -> console.error it.stack

###
# draw-book
###
# Initial book by the setup information from `masterpage.json` and the data of
# the whole prentation.
draw-book = lift (setup, data) ->
  $win = $ try window
  # calculate dots per cm by drawing an invisible <div>
  dots = React.render do
    DotsDetector unit: \cm
    document.getElementById \detector
  dpcm = dots.state.x
  scale-to-fit = (width, height) ->
    return undefined unless width and height
    px-width  = setup.width  * dpcm
    px-height = setup.height * dpcm
    if width / setup.ratio < height
      then width  / px-width
      else height / px-height

  book = React.render do
    Book do
      data: data
      scale: scale-to-fit $win.width!, $win.height!
    document.getElementById \app

  $win.resize ->
    <- requestAnimationFrame
    book.setProps scale: scale-to-fit $win.width!, $win.height!

###
# get-pages
###
# get page data by location
get-pages = lift (uri, setup) ->
  if location.search is /([1-9]\d*)/ or location.href is /page([1-9]\d*)/
    idx = +RegExp.$1
    idx = 1 if idx is 0
    idx = setup.total-pages if idx > setup.total-pages
  else
    idx = 1
  get-json "#uri/page#idx.json" .then -> [it]

###
# main
<- $
<- window.requestAnimationFrame
#uri = 'http://cnl.linode.caasih.net/books/two-tigers/'
uri = 'http://localhost:8081/books/two-tigers/'

setup = get-master uri .then ({ setup }) -> setup
data  = wrap-presentation get-pages uri, setup
draw-book setup, data

