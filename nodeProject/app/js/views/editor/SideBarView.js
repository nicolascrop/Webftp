define([
  'jquery',
  'underscore',
  'backbone',
  'models/FtpFolderModel/FtpFolderAnchorModel',
  'views/editor/SideBarView',
  'text!templates/editor/SideBarTemplate.html'
], function($, _, Backbone, FtpFolderAnchorModel, SideBarView, SideBarTemplate){

  var SideBarView = Backbone.View.extend({
    el: $("#appli-content"),
    
    initialize: function(){
      this.anchor = undefined;
    },

    render: function(){
      var tmp = _.template( SideBarTemplate, this ); 
      this.$el.find("#side-bar").html(tmp);
      if (this.anchor !== undefined)
      {
        var txt = this.renderFilesAndFolders(this.anchor.filesAndFolders, 0);
        this.$el.find("#side-bar .liste").html(txt);
      }
    },

    renderFilesAndFolders: function(data, space){
      var self = this;
      var ret = "";
      _.each(data, function(f){
        if (f.type == "folder")
        {
          ret += "<li class='folder-title' data-target='" + f.path + "'><span class='ed-ico icon-directory'></span>" + f.name + "</li>";
          ret += "<li class='folder-data' data-path='" + f.path + "' style='display:" + f.childrenVisible + "'><ul>";
          ret += self.renderFilesAndFolders(f.filesAndFolders, space + 3);
          ret += "</ul></li>"
        }
        else
        {
          ret += "<li class='liste-file' data-target='" + f.path + "'><span class='ed-ico " + f.ico + "'></span>" + f.name + "</li>";
        }
      });
      return ret;
    },

    renderCallback: function(self)
    {
      var tmp = _.template( SideBarTemplate, self ); 
      self.$el.find("#side-bar").html(tmp);
      if (self.anchor !== undefined)
      {
        var txt = self.renderFilesAndFolders(self.anchor.filesAndFolders, 0);
        self.$el.find("#side-bar .liste").html(txt);
      }
    },

    events: {
      'dblclick #side-bar .liste li': 'open',
      'click .anchor': 'setAnchor',
      'click .folder-title': 'displayFolder'
    },

    open: function(event){
      var $target = $(event.currentTarget);
      if (this.collection.getActive() !== undefined)
      {
        if($target.attr("data-type") == "folder")
          this.collection.getActive().explore($target.text(), this.renderCallback, this);
        // if($target.attr("data-type") == "file")
        //   this.collection.getActive().getfile($target.text(), this.sendPreviewReady, this);          
      }
    },

    setAnchor: function(){
      if (this.anchor === undefined && this.collection.getActive() !== undefined)
        if (this.collection.getActive().error == 0)
        {
          this.anchor = new FtpFolderAnchorModel({currentFolder: this.collection.getActive()});
          this.render();
        }
    },

    displayFolder: function(event){
      var $target = $(event.currentTarget);
      console.log($target.attr("data-target"))
      this.anchor.toggleFolder($target.attr("data-target"), this.renderCallback, this);
    }
  });

  return SideBarView;
  
});
