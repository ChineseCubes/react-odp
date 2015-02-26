require! {
  cpr: _cpr
  rsvp: { Promise }
  '../../../src/async': { lift }
}

cpr = lift (src, dst) -> new Promise (resolve, reject) ->
  _cpr src, dst, {
    delete-first: on
    overwrite: on
    confirm: on
  }, (err, files) ->
    | err => reject err
    | _   => resolve { src, files }

module.exports = cpr

