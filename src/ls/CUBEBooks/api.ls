require! request



remote = 'https://apis-beta.chinesecubes.com/CubeTalks'

get = !(path, done) ->
  err, res, body <- request do
    method: \GET
    encoding: null
    uri: path
  if err
    then done err
    else done err, body

get-json = !(path, done) ->
  err, res, body <- request path
  if err
    then done err
    else done err, JSON.parse body



class CubeList
  ([it]) ~> this <<< it
  getSound: !(done) -> get "#remote/sentencesound/#{@id}" done

class Cube extends CubeList
  ~> super it
  getSound:  !(done) -> get "#remote/cubesound/#{@id}"  done
  getStroke: !(done) -> get "#remote/cubestroke/#{@id}" done



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
