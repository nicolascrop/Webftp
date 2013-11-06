define([
  'jquery',
  'underscore',
  'backbone',
  'models/FtpFolderModel/FtpFolderModel'
], function($, _, Backbone, FtpFolderModel){
  var FtpFolderList = Backbone.Collection.extend({
    model: FtpFolderModel,
    
    initialize: function(){

    },

    getActive: function(){
      for (var m in this.models)
      {
        if (this.models[m].active == true)
          return this.models[m];
      }
    },

    unActive: function(){
      for (var m in this.models)
        this.models[m].active = false;
    }

  });
 
  return FtpFolderList;
});
