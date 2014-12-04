(function(){
  var NotifyMixin;
  NotifyMixin = {
    notify: function(){
      var owner, ref$;
      owner = this;
      while (owner._owner) {
        owner = owner._owner;
      }
      return owner != null ? (ref$ = owner.props) != null ? ref$.onNotify.apply(this, arguments) : void 8 : void 8;
    }
  };
  module.exports = NotifyMixin;
}).call(this);
