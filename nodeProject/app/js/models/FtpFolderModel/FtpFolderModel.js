define([
  'underscore',
  'backbone',
  'icones'
], function(_, Backbone, Icones) {

  var FtpFolderModel = Backbone.Model.extend({

      defaut:{
        active: false,
        filesAndFolders: [],
        length: 1,
        host: "",
        login: "",
        mdp: "",
        order: ""
      },

      initialize: function( options ) {
        this.error = 0;
        this.errortxt = "";
        this.id = options.size;
        this.path = "/";
        this.host = options.host;
        this.login = options.login;
        this.mdp = options.password;
        this.port = options.port;
  		},

      buildFilesAndFolders: function(data){
        var self = this;
        this.filesAndFolders = data;
         _.each(this.filesAndFolders, function(file){
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
        this.orderByNom();
      },

      orderByNom: function(){
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
        if (this.order != "name")
          this.filesAndFolders.sort(compare);
        else
          this.filesAndFolders.reverse(compare);
        this.order = "name";
      },

      orderByOwner: function(){
        if (this.error > 0)
          return;
        function compare(a, b){
          if (a.owner.toLowerCase() > b.owner.toLowerCase())
            return 1;
          if (a.owner.toLowerCase() < b.owner.toLowerCase())
            return -1;
          return 0;
        }
        if (this.order != "owner")
          this.filesAndFolders.sort(compare);
        else
          this.filesAndFolders.reverse(compare);
        this.order = "owner";
      },

      orderBySize: function(){
        if (this.error > 0)
          return;
        function compare(a, b){
          if (a.size > b.size)
            return 1;
          if (a.size < b.size)
            return -1;
          return 0;
        }
        if (this.order == "size")
          this.filesAndFolders.sort(compare);
        else
          this.filesAndFolders.reverse(compare);
        this.order = "size";
      },

      orderByDate: function(){
        if (this.error > 0)
          return;
        function compare(a, b){
          dateAD = a.date.substr(0, 10).split("-");
          dateAH = a.date.substr(11, 8).split(":");
          dateBD = b.date.substr(0, 10).split("-");
          dateBH = b.date.substr(11, 8).split(":");
          dateA = Date.UTC(dateAD[0], dateAD[1], dateAD[2], dateAH[0], dateAH[1], dateAH[2]);
          dateB = Date.UTC(dateBD[0], dateBD[1], dateBD[2], dateBH[0], dateBH[1], dateBH[2]);
          console.log(dateA);
          if (dateA > dateB)
            return 1;
          if (dateB > dateA)
            return -1;
          return 0;
        }
        if (this.order == "date")
          this.filesAndFolders.sort(compare);
        else
          this.filesAndFolders.reverse(compare);
        this.order = "date";
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
        this.preview = null;
        file = file.replace(/^\s+/g,'').replace(/\s+$/g,'');
        var self = this;
        if (this.path == "/")
          file = "/" + file;
        else
          file = this.path + "/" + file;
        $.post('/getfile', {file: file, host: this.host, port: this.port, password: this.mdp, login: this.login}, function(data) {
          try{
            if ($.parseJSON(data))
              var ok = self.manageError($.parseJSON(data));
          }catch(e){
            self.preview = data;
            callback(obj);
          }
        });
      },
      explore: function(folder, callback, obj){
        var self = this;
        folder = folder.replace(/^\s+/g,'').replace(/\s+$/g,'');
        if (folder == "..")
          this.path = this.path.substr(0, this.path.lastIndexOf("/"));
        else if (this.path == "/")
          this.path += folder;
        else
          this.path += "/" + folder;

        this.order = "";
        $.post('/connect', {path: this.path, host: this.host, port: this.port, password: this.mdp, login: this.login}, function(data) {
          var ok = self.manageError(data);
          if (ok) 
            self.buildFilesAndFolders(data);
          callback(obj);
        }, 'json');
      },

      connect: function(callback, obj){
        var self = this;
        this.order = "";

        $.post('/connect', {path: this.path, host: self.host, port: self.port, password: self.mdp, login: self.login}, function(data) {
          var ok = self.manageError(data);
          if (ok) 
            self.buildFilesAndFolders(data);
          callback(self, obj);
        }, 'json');
      },

		  url : function() {
	        return '/connect';
	    }


    });

  	return FtpFolderModel;

});




