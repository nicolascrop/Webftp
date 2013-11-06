// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'views/ftpConnect/FtpConnectView',
  'collections/ftpFolderList/FtpFolderList',
], function($, _, Backbone, FtpConnectView, FtpFolderList) {
  
  var AppRouter = Backbone.Router.extend({
    routes: {
      // Define some URL routes
      // 'projects': 'showProjects',
      // 'users': 'showContributors',
      
      // Default
      '*actions': 'defaultAction'
    }
  });
  
  var initialize = function(){

    var app_router = new AppRouter;

    app_router.on('route:defaultAction', function (actions) {
        app_router.folders = new FtpFolderList();
        var ftpConnectView = new FtpConnectView({ collection: app_router.folders });
        ftpConnectView.render();
        
    });

    // Unlike the above, we don't call render on this view as it will handle
    // the render call internally after it loads data. Further more we load it
    // outside of an on-route function to have it loaded no matter which page is
    // loaded initially.
   

    Backbone.history.start();
  };
  return { 
    initialize: initialize
  };
});
