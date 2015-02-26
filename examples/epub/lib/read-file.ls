#!/usr/bin/env lsc
require! {
  fs
  path
  rsvp: { Promise }:RSVP
  './argv'
}

running-as-script = not module.parent

read-file = (filepath, options = { encoding: null, flag: \r }) ->
  new Promise (resolve, reject) ->
    fs.readFile filepath, options, (err, data) ->
      return reject err if err
      resolve data

if running-as-script
  RSVP.on \error console.error
  { filename, args } = argv!
  if not args.length
    console.log "Usage: #filename <filename> [filename [filename [...]]]"
    process.exit!
  for filepath in args
    read-file path.resolve(filepath), encoding: \utf8
      .then console.log
else
  module.exports = read-file
