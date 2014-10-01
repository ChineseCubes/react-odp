require! request
Buffer = require 'buffer'
Buffer = Buffer.Buffer or Buffer



remote = 'https://apis-beta.chinesecubes.com/CubeTalks'

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
  getSoundDataURI: !(done) ->
    err, data <- get-base64 "#remote/sentencesound/#{@id}"
    if err
      then done err
      else done err, "audio/mpeg3;base64;#data"

class Cube extends CubeList
  ~> super it
  getSoundDataURI:  !(done) ->
    err, data <- get-base64 "#remote/cubesound/#{@id}"
    if err
      then done err
      else done err, "audio/mpeg3;base64;#data"
  getStrokeDataURI: !(done) ->
    err, data <- get-base64 "#remote/cubestroke/#{@id}"
    if err
      then done err
      else done err, "image/gif;base64;#data"



get-cube = !(str, done) ->
  err, data <- get-json "#remote/getcube/#{encodeURIComponent str}"
  if err
    then done err
    else done err, Cube data

get-cube-list = !(str, done) ->
  err, data <- get-json "#remote/sentence/#{encodeURIComponent str}"
  if err
    then done err
    else done err, CubeList data



Talks =
  get: (str, done) ->
    | not str.length  => done new Error 'too short'
    | str.length is 1 => get-cube str, done
    | otherwise       => get-cube-list str, done



API = { Talks }
module.exports = API
