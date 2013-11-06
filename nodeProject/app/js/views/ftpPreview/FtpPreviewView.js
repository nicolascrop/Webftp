define([
  'jquery',
  'underscore',
  'backbone',
  'ace/ace',
  'text!templates/ftpPreview/ftpPreviewTemplate.html'
], function($, _, Backbone, ace, ftpPreviewTemplate){

  var FtpPreviewView = Backbone.View.extend({
    el: $("#appli-content"),
    ed: "editor", 
    
    initialize: function(){
    	this.collection.on("previewReady", this.loadPreview, this);
    },

    loadPreview: function(){
    	this.render(this.loadEditor, this);
    },

    loadEditor: function(self){
    	self.editor = ace.edit(self.ed);
    	self.editor.setTheme("ace/theme/monokai");
    	self.editor.getSession().setMode("ace/mode/javascript");
    	self.editor.setValue(self.collection.getActive().preview);
    },

    render: function(cb, obj){
      
      var tmp = _.template( ftpPreviewTemplate, this ); 
      this.$el.find("#preview-content").html(tmp);
 	    if (cb !== undefined)
 	  	 cb(obj);
    },
    events: {
      
    },
  });

  return FtpPreviewView;
  
});
