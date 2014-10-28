#!/usr/bin/env lsc
require! {
  xmlbuilder: { create }
  lodash: { mapValues }
}

#{ mapValues } = require 'lodash'

metadata = ->
  ele = @ele 'metadata', { 'xmlns:dc': 'http://purl.org/dc/elements/1.1/' }
  mapValues it, (v, k) !~>
    | k is 'contributors'
      for i, contrib of v
        ele.nod 'dc:contributor', { id: "contrib#i" }, contrib
    | otherwise
      ele.nod "dc:#k", { id: k }, v
  this

epub =
  pkg: ->
    xml = create 'package', encoding: 'UTF-8'
      .att 'xmlns', 'http://www.idpf.org/2007/opf'
      .att 'version', '3.0'
      .att 'xml:lang', 'en'
      .att 'unique-identifier', 'identifier'
      .att 'prefix', 'rendition: http://www.idpf.org/vocab/rendition/#'
    metadata
      .call xml, do
        title: 'Little Red Cap Demo v5'
        creator: 'Audrey Tang'
        language: 'zh-Hant'
        identifier: 'LittleRedCapDemo'
        date: '2014-07-12'
        publisher: 'Locus Publishing Company'
        contributors:
          * 'Audrey Tang'
          * 'Alice Huang'
          * 'caasi Huang'
        rights: 'Locus Publishing Company all righths reserved.'
      .ele 'manifest'
      .up!
      .ele 'spine'
        .att 'page-progression-direction', 'ltr'
        .ele 'itemref'
          .att 'idref', 'page1'
          .att 'linear', 'yes'
        .up!
      .up!
      .end pretty: on

console.log epub.pkg!
