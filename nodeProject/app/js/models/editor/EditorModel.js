define([
  'underscore',
  'backbone',
], function(_, Backbone) {

  var EditorModel = Backbone.Model.extend({

      defaut:{
      },

      initialize: function( options ){
        this.ed = options.ed;
  		  this.tab = [];
        this.theme = "ace/theme/monokai";
        this.mode = "ace/mode/text";
        this.editor = null;
        this.value = "";
        this.width = 120;
        this.tWidth = 95;
        this.newTab();
      },

      newTab: function(name){
        var title = "New File";
        var t = {title: "New File", target: "None", active: true};
        if (name !== undefined && name != "")
        {
          title = name.substr(name.lastIndexOf("/"), name.length);
          t = {title: title, target: name, active: true};
        }

        var i = 2;
        while (this.checkIfNameExist(t.title)){
          t.title = title + " " + i;
          i++;
        }
        this.tab.push(t);
        if (!this.calculSize())
          this.tab.splice(this.tab.length - 1, 1);
        this.setActive();
      },

      setActive: function(){
          var act1 = null,
              act2 = null,
              i = 0;

          _.each(this.tab, function(t){
            if (t.active)
            {
              if (act1 == null)
                act1 = i;
              else
                act2 = i;
            }
            i++;
          });
          if (act1 !== null && act2 !== null)
            this.tab[act1].active = false;
          else if (act1 === null && act2 === null && this.tab.length > 0)
            this.tab[this.tab.length - 1].active = true;
      },

      calculSize: function(){
        var maxWidth = screen.width - 200 - 41;
        var normalWidth = 111;
        var nbEl = this.tab.length;
        var res = Math.floor(maxWidth / nbEl);

        if (res < 111)
        {
          if (res >= 50)
            this.width = res;
          else
            return 0;
        }
        else
          res = 110;
        this.width = res;
        this.tWidth = res - 25;
        return 1;
      },

      checkIfNameExist: function(name){
        var isIn = false;
        _.each(this.tab, function(t){
            if (name == t.title)
              isIn = true;
        });
        return isIn;
      },

      closeTab: function(id){
        this.tab.splice(id, 1);
        this.calculSize();
        this.setActive();
      },

      loadEditor: function(){
        if (this.editor === null){
          this.editor = ace.edit(this.ed);
          this.editor.setTheme(this.theme);
          this.editor.getSession().setMode(this.mode);
          this.editor.setValue(this.value);
          this.editor.setPrintMarginColumn(-1);
        }
      }
    });

  	return EditorModel;

});




