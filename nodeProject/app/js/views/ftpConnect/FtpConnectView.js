define([
  'jquery',
  'underscore',
  'backbone',
  'models/FtpFolderModel/FtpFolderModel',
  'views/editor/EditorView',
  'views/content/ContentView',
  'text!templates/ftpConnect/ftpConnectTemplate.html'
], function($, _, Backbone, FtpFolderModel, EditorView, ContentView, ftpConnectTemplate){

  var FtpConnectView = Backbone.View.extend({
    el: $("#appli-header"),
    
    initialize: function(){
      this.toolbar = new Object();
      this.toolbar.liste = false;
      this.toolbar.view = "editor";
      if (this.toolbar.view == "explorer")
        this.contentView = new ContentView({ collection: this.collection, toolbar: this.toolbar });
      else
        this.contentView = new EditorView({ collection: this.collection, toolbar: this.toolbar });
      $(window).bind('keydown', function(event) {
        if (event.ctrlKey || event.metaKey) {
          switch (String.fromCharCode(event.which).toLowerCase()) {
            case 's':
                event.preventDefault();
                this.contentView.save();
                break;
          }
        }
      });
    },

    render: function(){
      var tmp = _.template( ftpConnectTemplate, this ); 
      this.$el.html(tmp);
      this.contentView.render();
    },
    addModel: function(model, obj){
      obj.collection.add(model);
    },
    events: {
      'click .connect': 'ftpConnect',
      'click .btn-liste': 'toggleListe'
    },
    ftpConnect: function(){
      var that = this;
      var ftp = new FtpFolderModel({
        size: this.collection.length,
        host: that.$el.find(".hote").val(),
        login: that.$el.find(".login").val(),
        password: that.$el.find(".password").val(),
        port: that.$el.find(".port").val()
      });
      ftp.connect(this.addModel, this);
    },
    toggleListe: function(){
      if (this.$el.find(".btn-liste").hasClass("btn-active"))
      {
        this.$el.find(".btn-liste").removeClass('btn-active');
        this.toolbar.liste = false;
      }
      else
      {
        this.$el.find(".btn-liste").addClass('btn-active');
        this.toolbar.liste = true;
      }
      this.contentView.showOrHideListe();
    }
  });

  return FtpConnectView;
  
});
