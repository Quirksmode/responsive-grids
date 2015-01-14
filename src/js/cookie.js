function createCookie () {
    var me = this, 
    	expires, 
    	date, 
    	name,
    	days = 1;

    // Set expiration
    name = "NSPCCcookiename";
    date = new Date();
    date.setTime(date.getTime()+(days*24*60*60*1000));
    expires = "; expires="+date.toGMTString();
    value = true;

    // Set cookie
    document.cookie = name + "=" + value + expires + "; path=/";

    // jquery has load and can use library...
    $("body").removeClass("show-cookie");
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') { c = c.substring(1); }
        if (c.indexOf(name) != -1) { return c.substring(name.length, c.length); }
    }
    return 0;
}

// Check cookie storage
if( getCookie("NSPCCcookiename") ) {
	// console.log("COOKIE EXIST")
   
} else {

    setTimeout(function () {

        //console.log(document.getElementsByTagName('body')[0].getAttribute("class"))
        var existingClass = document.getElementsByTagName('body')[0].getAttribute("class");
        document.getElementsByTagName('body')[0].setAttribute("class", existingClass + " show-cookie");


    }, 100)
}
