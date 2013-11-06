(function($)
{
	$.ftpConnect = function( options, element ) {
		
		this.$el = $( element );
		this._init( options );
		
	};

    $.ftpConnect.prototype = {
	    _init: function(options){
	    	this.options = $.extend( true, {}, $.ftpConnect.defaults, options );
	    	this.$el.html(
	    			'<input type="text" placeholder="Host" class="hote" value="ns61220.ovh.net"/>' +
	    			'<input type="text" placeholder="Login" class="login" value="planet" />' +
	    			'<input type="password" placeholder="Password" class="password" value="kN6QkMyz" />' +
	    			'<input type="text" placeholder="Host" class="port" />' +
	    			'<input type="button" value="Connect" class="connect"/>');
	    	this._bind();
	    },
	    _bind: function(){
	    	var $ele = this.$el;
	    	$ele.find(".connect").click(function(){
	    		var host = $ele.find(".hote").val();
	    		var pass = $ele.find(".password").val();
	    		var login = $ele.find(".login").val();
	    		var port = $ele.find(".port").val();
	    		if (host == "" || login == "")
	    			return false;
	    		$.post("connect", {hote: host, password: pass, login: login, port: port}, function(data){
					if (data.length)
						$ele.trigger($.Event( "dataReceived", {ftpFiles: data, host: host, login: login} ));
	    		});
	    	});
	    }
    };
    $.fn.ftpConnect = function(options)
    {
    	return $.data( this, 'ftpconnect', new $.ftpConnect( options, this ) );
    };
})(jQuery);