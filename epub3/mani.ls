#!/usr/bin/env lsc
require! mime
{stdin, stdout} = process
stdin.resume!
stdin.setEncoding \utf8
data <- stdin.on \data
for ln in data.split /\n+/ | ln is /^(.*)(\.\w+)$/
    { $1: base, $2: ext } = RegExp
    id = ln.replace /\W+/g, \-
    console.log '    ', """
        <item href="#ln"
                   id="#id" media-type="#{ mime.lookup ext }" />
    """
