{ Promise, all }:RSVP = require 'rsvp'

RSVP.on \error ->
  console.log it.stack

db = new Promise (resolve, reject) ->
  indexedDB.open \BookDataBase
    ..onerror         = -> reject  it
    ..onsuccess       = -> resolve it.target.result
    ..onupgradeneeded = ->
      db = it.target.result
      objectStore = db.createObjectStore \settings, keyPath: \key
      objectStore.createIndex \key, \key, unique: true

save = (key, value) -> new Promise (resolve, reject) ->
  db.then ->
    transaction = it.transaction <[settings]> \readwrite
    transaction.onerror = -> reject it
    store = transaction.objectStore \settings
    request = store.put { key: key, value: value }
    request
      ..onerror   = -> reject it
      ..onsuccess = -> resolve it.target.result

load = (key) -> new Promise (resolve, reject) ->
  db.then ->
    transaction = it.transaction <[settings]> \readwrite
    transaction.onerror = -> reject it
    store = transaction.objectStore \settings
    request = store.get key
    request
      ..onerror   = -> reject it
      ..onsuccess = -> resolve it.target.result.value

module.exports = { save, load }
