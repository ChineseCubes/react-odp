texts-from-presentation = (p) ->
  texts = []
  for child in p.children
    if child.name is \page
      page = []
      for child in child.children
        if child.name is \frame
          for child in child.children
            if child.name is \text-box
              for child in child.children
                if child.name is \p
                  for child in child.children
                    if child.name is \span and child.text
                      page.push child.text
      texts.push page
  texts

class Audio
  (presentation, vtt, mp3, onLoad, onPlay, onEnd, onPause, @onUpdate) ~>
    @texts = texts-from-presentation presentation
    @audio = try
      Howler.iOSAutoEnable = false
      new Howl urls: [mp3]
    @audio
      ..on \load  onLoad
      ..on \play  onPlay
      ..on \pause onPause
    @_onEnd = onEnd
    @sprites = {}
    for i, cue of vtt.cues
      bgn = cue.startTime
      end = cue.endTime
      @sprites[cue.text] = [bgn * 1000, (end - bgn) * 1000]
    @audio.sprite @sprites
    @current-text = ''
  play: (page-num) ->
    update = ~>
      @onUpdate? @time!
      @rid = requestAnimationFrame update
    @rid = requestAnimationFrame update
    count = 0
    ts = @texts[page-num]
    return unless ts
    @current-text = ts[count]
    on-end = ~>
      if ++count < ts.length
        @current-text = ts[count]
        setTimeout read, 750
      else
        @current-text = ''
        clean!
        setTimeout @_onEnd, 0
    clean = ~>
      @audio
        ..off \end   on-end
        ..off \pause clean
    @audio
      ..on \end   on-end
      ..on \pause clean
    read = ~>
      @audio
        ..stop @current-text
        ..play @current-text
    read!
  stop: ->
    cancelAnimationFrame @rid
    @audio.pause!
  time: -> (@sprites[@current-text]?0 or 0) / 1000 + (@audio?pos! or 0)
  process: ->
    switch it.action
      | \play => @play it.page-num
      | \stop => @stop!
      | _     => console.warn "unknown action: #it"

module.exports = Audio
