require! {
  fs
  path
  cp: _cp
  rsvp: { Promise }
  '../../../src/async': { lift }
}

cp = lift (src, dst) -> new Promise (resolve, reject) ->
  #relpath = path.relative process.cwd!, src
  _cp src, dst, (err) ->
    | err => reject err
    | _   => resolve { src, dst }

module.exports = cp

