#!/usr/bin/env lsc
require! {
  fs
  path
  rsvp: { Promise }:RSVP
  './argv'
}

running-as-script = not module.parent

read-dir = (dirpath) -> new Promise (resolve, reject) ->
  fs.readdir dirpath, (err, files) ->
    return reject err if err
    files .= map -> path.resolve dirpath, it
    resolve files

if running-as-script
  RSVP.on \error console.error
  { filename, args } = argv!
  if not args.length
    console.log "Usage: #filename <dirname>"
    process.exit!
  read-dir path.resolve(args.0) .then ->
    for it => console.log ..
else
  module.exports = read-dir
