function getIcone(ext, type){
	if (type == "d")
	  return "icon-directory";
	if (ext == "gz" || ext == "zip" || ext == "7z" || ext == "rar" || ext == "iso" || ext == "ace" || ext == "tar")
	  return "icon-archive";
	if (ext == "bin")
	  return "icon-binary";
	if (ext == "cfg")
	  return "icon-cfg";
	if (ext == "css")
	  return "icon-css";
	if (ext == "doc" || ext == "docx" || ext == "odt")
	  return "icon-doc";
	if (ext == "php")
	  return "icon-php";
	return "icon-binary";
}