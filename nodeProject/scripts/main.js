$(document).ready(function(){
	$("#appli-content").height(window.innerHeight - $("#appli-header").height);
	
	$(".header-action").ftpConnect();
	$("#ftp-window").tabManager( {ftpEl: $(".header-action")} );//lien entre le tabManager et la connection ftp
});