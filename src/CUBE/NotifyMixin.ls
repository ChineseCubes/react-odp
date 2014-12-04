NotifyMixin =
  notify: ->
    owner = this
    while owner._owner => owner = owner._owner
    owner?props?onNotify ...

module.exports = NotifyMixin

