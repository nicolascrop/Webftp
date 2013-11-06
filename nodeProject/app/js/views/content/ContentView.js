define([
  'jquery',
  'underscore',
  'backbone',
  'views/ftpPreview/FtpPreviewView',
  'text!templates/content/contentTemplate.html'
], function($, _, Backbone, FtpPreviewView, ContentTemplate){

  var ContentView = Backbone.View.extend({
    el: $("#appli-content"),
    initialize: function(){
      var self = this;
      this.collection.on("add", function(model){
        self.collection.unActive();
        model.active = true;
        self.render();
      });
      this.preview = new FtpPreviewView({ collection: this.collection });
    },

    save: function(){

    },

    events: {
      'click .ftp-title li': 'selectServeur',
      'click .title-close': 'closeServeur',
      'click .title .ftp-name': 'orderByNom',
      'click .title .ftp-owner': 'orderByOwner',
      'click .title .ftp-date': 'orderByDate',
      'click .title .ftp-size': 'orderBySize',
      'dblclick .ftp-content tbody tr': 'actOpen'
    },
    orderByNom: function(){
      if (this.collection.getActive() !== undefined)
        this.collection.getActive().orderByNom();
      this.render();
    },
    orderBySize: function(){
      if (this.collection.getActive() !== undefined)
        this.collection.getActive().orderBySize();
      this.render();
    },
    orderByDate: function(){
      if (this.collection.getActive() !== undefined)
        this.collection.getActive().orderByDate();
      this.render();
    },
    orderByOwner: function(){
      if (this.collection.getActive() !== undefined)
        this.collection.getActive().orderByOwner();
      this.render();
    },
    actOpen: function(event){
      var $target = $(event.currentTarget);
      if (this.collection.getActive() !== undefined)
      {
        if($target.attr("data-type") == "folder")
          this.collection.getActive().explore($target.find(".ftp-name").text(), this.renderCallback, this);
        if($target.attr("data-type") == "file")
          this.collection.getActive().getfile($target.find(".ftp-name").text(), this.sendPreviewReady, this);          
      }
    },
    closeServeur: function(event){
      var $target = $(event.currentTarget);
      var id = $target.parent().parent().attr("data-id");
      this.collection.remove(id);
      this.render();  
      event.preventDefault();
    },
    selectServeur: function(event){
      var $target = $(event.currentTarget);
      var id = $target.attr("data-id");
      this.collection.unActive();
      this.collection.get(id).active = true;
      this.render();
    },
    sendPreviewReady: function(obj){
      obj.collection.trigger("previewReady");
    },
    showOrHideListe: function(){
      if (this.options.toolbar.liste)
        this.$el.find(".ftp-title").show();
      else
        this.$el.find(".ftp-title").hide();
    },
    renderCallback: function(self)
    {
      var tmp = _.template( ContentTemplate, self ); 
      self.$el.html(tmp);
    },
    render: function(){
      
      var tmp = _.template( ContentTemplate, this ); 
      this.$el.html(tmp);
      this.preview.render();
    }

  });

  return ContentView;
  
});
