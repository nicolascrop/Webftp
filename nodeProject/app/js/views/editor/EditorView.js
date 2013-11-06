define([
  'jquery',
  'underscore',
  'backbone',
  'ace/ace',
  'models/editor/EditorModel',
  'views/editor/EditorView',
  'views/editor/SideBarView',
  'text!templates/editor/editorTabTemplate.html',
  'text!templates/editor/editorTemplate.html'
], function($, _, Backbone, ace, EditorModel, EditorView, SideBarView, EditorTabTemplate, EditorTemplate){

  var EditorView = Backbone.View.extend({
    el: $("#appli-content"),
    initialize: function(){
      var self = this;
      this.collection.on("add", function(model){
        self.collection.unActive();
        model.active = true;
        self.sideBar.render();
      });
      this.model = new EditorModel({ed: "text-editor"});
      this.sideBar = new SideBarView({collection: this.collection});
      this.anchor = null;
    },

    render: function(){
      
      var tmp = _.template( EditorTemplate, this ); 
      this.$el.html(tmp);
      this.renderTab();
      this.sideBar.render();
      this.model.loadEditor();

    },

    renderTab: function(){
      var tmp = _.template( EditorTabTemplate, this );
      this.$el.find(".tab-editor").html(tmp);
    },

    save: function(){
      if (this.anchor !== null)
      {

      }
    },

    events: {
      'click .tab-close': 'closeTab',
      'click #new-tab': 'newTab'
    },

    closeTab: function(event){
      var $target = $(event.currentTarget);
      var id = $target.parent().index();
      this.model.closeTab(id);
      this.renderTab();
    },
    newTab: function(){
      this.model.newTab();
      this.renderTab();
    }

  });

  return EditorView;
  
});
