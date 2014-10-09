(function(){
  var React, ref$, div, i, onClick, ActionMenu;
  React = require('react');
  ref$ = React.DOM, div = ref$.div, i = ref$.i;
  onClick = require('./utils').onClick;
  ActionMenu = React.createClass({
    displayName: 'CUBE.ActionMenu',
    getDefaultProps: function(){
      return {
        buttons: ['cut'],
        disabled: [false],
        onChange: function(){
          throw Error('unimplemented');
        }
      };
    },
    getInitialState: function(){
      var actived, i;
      actived = [];
      for (i in this.props.buttons) {
        actived[i] = false;
      }
      return {
        actived: actived
      };
    },
    render: function(){
      var buttons, type;
      buttons = this.props.buttons;
      type = buttons.length === 1 ? 'single' : 'multiple';
      return div({
        className: "actions " + this.props.className
      }, div({
        className: "menu " + type
      }, div({
        className: 'ui buttons'
      }, (function(){
        var i$, results$ = [];
        for (i$ in buttons) {
          results$.push((fn$.call(this, i$, buttons[i$])));
        }
        return results$;
        function fn$(idx, btn){
          var actived, disabled, ref$, this$ = this;
          actived = this.state.actived[idx] ? 'actived' : '';
          disabled = this.props.disabled[idx] ? 'disabled' : '';
          return div((ref$ = {
            key: "button-" + idx,
            className: "ui icon button black " + actived + " " + disabled
          }, ref$[onClick + ""] = function(it){
            var i, actived;
            it.stopPropagation();
            return this$.setState({
              actived: (function(){
                var i$, to$, results$ = [];
                for (i$ = 0, to$ = this.state.actived.length; i$ < to$; ++i$) {
                  i = i$;
                  actived = i === +idx ? !this.state.actived[i] : false;
                  this.props.onChange.call(this, it, buttons[i], actived, fn$);
                  results$.push(actived);
                }
                return results$;
                function fn$(){
                  this$.state.actived[idx] = false;
                  return this$.setState({
                    actived: this$.state.actived
                  });
                }
              }.call(this$))
            });
          }, ref$), i({
            className: "icon " + this.icon(btn)
          }));
        }
      }.call(this)))));
    }
  });
  module.exports = ActionMenu;
}).call(this);
