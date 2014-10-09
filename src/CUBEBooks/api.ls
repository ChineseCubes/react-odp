require! request
Buffer = require 'buffer'
Buffer = Buffer.Buffer or Buffer



remote-talks = 'https://apis-beta.chinesecubes.com/CubeTalks'
remote-books = 'https://apis-beta.chinesecubes.com/CubeBooks'

get-base64 = !(path, done) ->
  err, res, body <- request path
  if err
    then done err
    else done err, new Buffer(body)toString(\base64)

get-json = !(path, done) ->
  err, res, body <- request path
  if err
    then done err
    else done err, JSON.parse body



class CubeList
  ([it]) ~> this <<< it
  # XXX: Howler should test MIME type instead of extension
  # BTW, the base64 decoding in Howler may also have problem.
  # Should patch it someday.
  soundURI: -> "#remote-talks/sentencesound/#{@id}.mp3"
  getSoundDataURI: !(done) ->
    err, data <- get-base64 @soundURI!
    if err
      then done err
      # FIXME: use wrong MIME type for Howler
      # https://github.com/goldfire/howler.js/issues/218
      else done err, "data:audio/mp3;base64,#data"

class Cube extends CubeList
  ~> super it
  soundURI: -> "#remote-talks/cubesound/#{@id}.mp3"
  strokeURI: -> "#remote-talks/cubestroke/#{@id}"
  getSoundDataURI:  !(done) ->
    err, data <- get-base64 @soundURI!
    if err
      then done err
      else done err, "data:audio/mp3;base64,#data"
  getStrokeDataURI: !(done) ->
    err, data <- get-base64 @strokeURI!
    if err
      then done err
      else done err, "data:image/gif;base64,#data"

class Book
  ~> this <<< it
  getDetails: !(done) ->
    err, data <- get-json "#remote-books/books/#{@id}"
    if err
      then done err
      else done err, this <<< data



get-cube = !(str, done) ->
  err, data <- get-json "#remote-talks/getcube/#{encodeURIComponent str}"
  if err
    then done err
    else done err, Cube data

get-cube-list = !(str, done) ->
  err, data <- get-json "#remote-talks/sentence/#{encodeURIComponent str}"
  if err
    then done err
    else done err, CubeList data

get-book-list = !(str, done) ->
  err, data <- get-json "#remote-books/booklist/#{encodeURIComponent str}"
  if err
    then done err
    else done err, (for d in data => Book d)



Talks =
  get: (str, done) ->
    | not str.length  => done new Error 'too short'
    | str.length is 1 => get-cube str, done
    | otherwise       => get-cube-list str, done
  recommend: (str, done) ->
    | not str.length or
      str.length is 1 => done new Error 'too short'
    | otherwise       =>
      # FIXME: should return CubeLists
      get-json "#remote-talks/recommend/#{encodeURIComponent str}" done

Books =
  get: (str, done) ->
    | str.length is undefined => done new Error 'not a string'
    | otherwise               => get-book-list str, done



API = { Talks, Books }
module.exports = API
