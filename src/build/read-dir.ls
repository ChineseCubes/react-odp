#!/usr/bin/env lsc
require! {
  fs
  path
  rsvp: { Promise }
}

running-as-script = not module.parent

read-dir = (dirpath) -> new Promise (resolve, reject) ->
  fs.readdir dirpath, (err, files) ->
    return reject err if err
    files .= map -> path.resolve dirpath, it
    resolve files

if running-as-script
  [ ,, dirpath ] = process.argv
  read-dir path.resolve(dirpath) .then ->
    for it => console.log ..
else
  module.exports = read-dir
