require! {
  request
  'rsvp': { Promise, all }
}

lift = (f) -> (...args) -> all args .then (-> f.apply this, it)

get = lift (uri) -> new Promise (resolve, reject) ->
  err, res, body <-! request method: \GET, uri: uri
  switch
  | err                     => reject err
  # XXX: the stausCode is 0 in iBook after reloading, but the body is OK
  #| res.statusCode isnt 200 => reject new Error "not OK: #{JSON.stringify res,, 2}"
  | otherwise               => resolve body

get-json = lift (uri) -> get uri .then -> JSON.parse it

get-bin = lift (uri) -> new Promise (resolve, reject) ->
  err, res, body <-! request method: \GET, uri: uri, encoding: \binary
  switch
  | err                     => reject err
  #| res.statusCode isnt 200 => reject new Error "not OK: #{JSON.stringify res,, 2}"
  | otherwise               => resolve new Buffer body, \binary

module.exports = {
  lift
  get
  get-json
  get-bin
}

