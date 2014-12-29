#!/usr/bin/env lsc
require! {
  fs
  path
  rsvp: { Promise }
}

running-as-script = not module.parent

read-file = (filepath, options = { encoding: null, flag: \r }) ->
  new Promise (resolve, reject) ->
    fs.readFile filepath, options, (err, data) ->
      return reject err if err
      resolve data

if running-as-script
  [ ,, ...paths ] = process.argv
  for filepath in paths
    read-file path.resolve(filepath), encoding: \utf8
      .then console.log
else
  module.exports = read-file
