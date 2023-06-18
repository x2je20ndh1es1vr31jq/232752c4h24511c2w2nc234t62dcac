var LUT = {};

LUT.downloadInIFrame = function (url) {
    var iframe = document.createElement('iframe');
    iframe.style.display = "none";
    iframe.src = url;
    document.body.appendChild(iframe);
}

LUT.windowOpenEnabled = true;

LUT.windowOpen = function (url) {
    if(LUT.windowOpenEnabled){
        LUT.windowOpenEnabled = false;
        window.open(url);
    }else{
        console.log("LUT.windowOpenEnabled == false", url);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    let enabler = function(){
        LUT.windowOpenEnabled = true;
        console.log("enabler");
    };
    console.log("DOMContentLoaded");
    document.body.addEventListener("click", enabler);
    document.body.addEventListener("dblclick", enabler);
});

LUT.fixBackButton = function (cb) {
    var i;
    try {
        for (i = 0; i < 3; i++){
            // console.log("hash", i);
            // window.location.hash = "#" + i;

            console.log("pushState", i);
            history.pushState({}, document.title, window.location.toString());
        }
    } catch (e) {
        console.error(e);
    }

    try{
        window.onpopstate = function (event) {
            console.log("onpopstate: ", document.location, ", state: ", event.state);
            // try {
            //     history.pushState({}, document.title, window.location.href);
            //     console.log("pushed from popstate");
            // }catch (e){
            //     console.error(e);
            // }
            cb();
        }
        console.log("onpopstate was set");
    }catch (e){
        console.error(e);
    }
}

LUT.openFullscreen = function() {
    try{
        var elem = document.body;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
            elem.msRequestFullscreen();
        }
    }catch (e) {
        console.error(e);
    }
}

LUT.setCookie = function (name, value, options) {
    options = options || {};
    options.path = '/';

    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (var optionKey in options) {
        if(!options.hasOwnProperty(optionKey)){
            continue;
        }
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }

    document.cookie = updatedCookie;
}

LUT.getCookie = function(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([.$?*|{}()\[\]\\\/+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

LUT.deleteCookie = function (name) {
    LUT.setCookie(name, "", {
        'max-age': -1
    })
}

/**
 * "Increment" cookie value and return new value
 * @param name
 */
LUT.incCookieCounter = function (name){
    var val = LUT.getCookie(name) || 0;
    val = val * 1;
    val += 1;
    LUT.setCookie(name, val);
    return val;
}

LUT.getCookieCounter = function (name){
    var val = LUT.getCookie(name) || 0;
    val = val * 1;
    return val;
}

LUT.showElement = function(id){
    document.getElementById(id).style.display = 'block';
}

LUT.hideElement = function(id){
    document.getElementById(id).style.display = 'none';
}

LUT.isObject = function(o) {
    return typeof o === 'object' && o !== null;
}

LUT.uuidv4 = function(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

LUT.randomFromArray = function (items){
    return items[Math.floor(Math.random() * items.length)];
}

LUT.initId = function(cookieName){
    var id = LUT.getCookie(cookieName);
    if(!id){
        id = LUT.uuidv4();
        LUT.setCookie(cookieName, id);
    }
    return id;
}

/**
 * Set params for every postStat request
 * @param params
 */
LUT.postStatParams = {};
LUT.setPostStatParams = function(params){
    LUT.postStatParams = params;
}

LUT.postStatURL = '/skip/stat.txt';
LUT.setStatURL = function (url){
    LUT.postStatURL = url;
}

LUT.postStat = function(event_type, query_params){
    var xhr = new XMLHttpRequest();
    var date = new Date();
    var ms = date.getTime();
    var qs = 'event_type=' + encodeURIComponent(event_type);
    qs += '&ms=' + ms;
    var k;
    for(k in LUT.postStatParams){
        if(LUT.postStatParams.hasOwnProperty(k)){
            qs += '&' + k + '=' + encodeURIComponent(LUT.postStatParams[k]);
        }
    }
    if(query_params){
        if(LUT.isObject(query_params)){
            for(k in query_params){
                if(query_params.hasOwnProperty(k)){
                    if(typeof query_params[k] === 'boolean'){
                        query_params[k] = query_params[k] ? 1 : 0;
                    }
                    qs += '&' + k + '=' + encodeURIComponent(query_params[k]);
                }
            }
        }else {
            qs += '&' + query_params;
        }
    }
    xhr.open("GET", LUT.postStatURL + '?' + qs, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send();
}

LUT.parse_query_string = function (query) {
    var vars = query.split("&");
    var query_string = {};
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        var key = decodeURIComponent(pair[0]);
        var value = decodeURIComponent(pair[1]);
        // If first entry with this name
        if (typeof query_string[key] === "undefined") {
            query_string[key] = decodeURIComponent(value);
            // If second entry with this name
        } else if (typeof query_string[key] === "string") {
            var arr = [query_string[key], decodeURIComponent(value)];
            query_string[key] = arr;
            // If third or later entry with this name
        } else {
            query_string[key].push(decodeURIComponent(value));
        }
    }
    return query_string;
}

LUT.$_GET = LUT.parse_query_string(
    location.search.toString().substr(1)
);
