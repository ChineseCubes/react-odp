require! {
  'rsvp': { Promise, all }
}

lift = (f) -> (...args) -> all args .then (-> f.apply this, it)

module.exports = lift

