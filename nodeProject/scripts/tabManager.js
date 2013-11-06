(function($)
{
	$.tabManager = function( options, element ) {
		
		this.$el = $( element );
		this._init( options );
		
	};

    $.tabManager.prototype = {
	    _init: function(options){
	    	this.options = $.extend( true, {}, $.tabManager.defaults, options );
	    	this.listeTab = "<ul class='tm-tabliste'><li data-content='defaut' class='active'></li></ul>";
	    	this.content = new Object();
	    	this.content["defaut"] = "<div class='defaut'>No server selected</div>";
	    	this.curContent = "defaut";
	    	this._generateWindow();
	    	this._bind();
	    },
	    _generateWindow: function(){
	    	this.$el.html(this.listeTab + this.content[this.curContent]);
	    },
	    _bind: function(){
	    	var $ele = this;
	    	this.options.ftpEl.on("dataReceived", function(e){
	    		$ele.content[e.host + "@" + e.login] = "<ul class='tm-listfiles'>";
	    		for (var f in e.ftpFiles)
	    			$ele.content[e.host + "@" + e.login] += "<li>" + $ele.displayFTPElement(e.ftpFiles[f]) + "</li>";

	    		$ele.content[e.host + "@" + e.login] += "</ul>";
	    		$ele.$el.find(".tm-tabliste .active").removeClass('active');
	    		$ele.$el.find(".tm-tabliste").append("<li class='active' data-content='" + e.host + "@" + e.login + "'>" + e.host + "@" + e.login + "</li>");
	    		$ele.listeTab = $ele.$el.find(".tm-tabliste").html();
	    		$ele.curContent = e.host + "@" + e.login;
	    		$ele._generateWindow();
	    	})
	    },
	    displayFTPElement: function(obj){
	    	var html = "";
	    	if (obj.type == "d")
	    		html = "<span class='ico folder'></span>";
	    	else
	    		html = "<span class='ico file " + this.getFileType(obj.name) + "'></span>";
	    },
	    getFileType: function(name){
	    	if (name.lastIndexOf(".") != -1)
	    	{
	    		var ext = name.substr(name.lastIndexOf(".") + 1);
	    		if (ext == "png" || ext == "bmp" || ext == "jpg" || ext == "jpeg")
	    			return "pic";
	    		else if (ext == "txt" ||)
	    	}
	    }
    };
    $.fn.tabManager = function(options)
    {
    	return $.data( this, 'tabmanager', new $.tabManager( options, this ) );
    };
})(jQuery);