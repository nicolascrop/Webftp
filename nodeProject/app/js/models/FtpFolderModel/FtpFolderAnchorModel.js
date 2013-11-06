define([
  'underscore',
  'backbone',
], function(_, Backbone) {

  var FtpFolderAnchorModel = Backbone.Model.extend({

      defaut:{
        length: 1
      },

      initialize: function( options ) {
        this.error = 0;
        this.errortxt = "";
        this.path = options.currentFolder.path;
        this.host = options.currentFolder.host;
        this.login = options.currentFolder.login;
        this.mdp = options.currentFolder.mdp;
        this.port = options.currentFolder.port;
        this.filesAndFolders = [];
        if (options.currentFolder.path == "/")
          options.currentFolder.path = "";
        this.addToFolder(options.currentFolder.filesAndFolders, this.filesAndFolders, options.currentFolder.path, "block");
      },

      addToFolder: function(data, root, path, visible){
        console.log(data);
        var self = this;
        _.each(data, function(file){
          root.push({
            name: file.name,
            path: path + "/" + file.name,
            type: file.typeToPrint,
            ext: file.ext,
            ico: file.ico,
            childrenVisible: "none",
            visible: visible,
            filesAndFolders: []
          });
        });
        console.log(this);
      },

      toggleFolder: function(path, callback, obj){
        this.folderSearched = undefined;
        this.findFolder(path, this.filesAndFolders);
        var target = this.folderSearched;
        if (target !== undefined)
        {
          if (target.childrenVisible == "block")
          {
            target.childrenVisible = "none";
            callback(obj);
          }
          else
          {
            target.childrenVisible = "block";
            this.explore(target.path, target.filesAndFolders, callback, obj);
          }
        }
        else
          callback(obj);
      },

      findFolder: function(path, root){
        var self = this;
        _.each(root, function(f){
          if (f.type == "folder")
          {
            if (f.path == path)
              self.folderSearched = f;
            else
            {
              self.findFolder(path, f.filesAndFolders);
            }
          }
        });
      },

      buildFilesAndFolders: function(data){
         _.each(data, function(file){
          var date = file.date.substr(0, 10) + " " + file.date.substr(11, 8);
          file.dateToPrint = date;
          file.rightsToPrint = file.type + file.rights.user + file.rights.group + file.rights.other;
          if (file.type == "-")
            file.typeToPrint = "file";
          else
            file.typeToPrint = "folder";
          file.ext = file.name.substr(file.name.lastIndexOf(".") + 1, file.name.length);
          file.ico = getIcone(file.ext, file.type);
        });
        this.orderByNom(data);
        return data;
      },

      orderByNom: function(filesAndFolders){
        if (this.error > 0)
          return;
        function compare(a, b){
          if (a.type == "d" && b.type == "-")
            return -1;
          if (a.type == "-" && b.type == "d")
            return 1;
          if (a.name.toLowerCase() > b.name.toLowerCase())
            return 1;
          if (a.name.toLowerCase() < b.name.toLowerCase())
            return -1;
          return 0;
        }

        filesAndFolders.sort(compare);
      },

      
      manageError: function(data){
        if (data.code !== undefined && data.code != "0")
        {
          this.error = data.code;
          this.errorTxt = (data.code == "ENOTFOUND") ? "No internet connection" : data.txt;
          return 0;
        }
        return 1;
      },

      /*Actions Serveur*/
      getfile: function(file, callback, obj){
        file = file.replace(/^\s+/g,'').replace(/\s+$/g,'');
        var self = this;
        if (this.path == "/")
          file = "/" + file;
        else
          file = this.path + "/" + file;
        $.post('/getfile', {file: file, host: this.host, port: this.port, password: this.mdp, login: this.login}, function(data) {
          var ok = 1;
          try{
            if ($.parseJSON(data))
              ok = self.manageError($.parseJSON(data));
          }catch(e){
              ok = 1;
          }
          if (ok)
            callback(obj, data);
        });
      },
      explore: function(path, root, callback, obj){
        var self = this;

        $.post('/connect', {path: path, host: this.host, port: this.port, password: this.mdp, login: this.login}, function(data) {
          var ok = self.manageError(data);
          if (ok)
          {
            data = self.buildFilesAndFolders(data);
            self.addToFolder(data, root, path, true);
          }
          callback(obj);
        }, 'json');
      }


    });

  	return FtpFolderAnchorModel;

});




