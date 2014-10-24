
var console = console || {
    log: function(val) {

    }
};

var CIB = CIB || {};
CIB.Core = CIB.Core || {};
CIB.Const = CIB.Const || {};

CIB.ensureMQuery = function (fn) {
    EnsureScriptFunc('mQuery.js', 'm$', function () { });
    SP.SOD.executeOrDelayUntilScriptLoaded(function () {
        if (fn)
            fn();
    }, "mquery.js");

};


CIB.urlParam = function (name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
        return null;
    } else {
        return results[1] || 0;
    }
};


CIB.UnMask = function (notification) {
    var table = m$("#FormTable");
    if (table) {
        table.find("input, textarea, select").forEach(function (el, i, a) {
            a[i].removeAttribute("disabled");
        });
        var link = m$("#CIBAddLink");
        if (link.length > 0) {
            link[0].style.display = "inline";
        }
    }
    if (notification) {
        SP.UI.Notify.removeNotification(notification);
    }
};

CIB.parseFieldAttr = function (attr) {
    var returnValue = undefined;
    if (attr) {
        returnValue = attr.value;
    }
    return returnValue;
};

CIB.parseFieldXml = function (xml) {
    var xmlDoc = "";
    if (window.DOMParser) {
        var parser = new DOMParser();
        xmlDoc = parser.parseFromString(xml, "text/xml");
    } else {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = false;
        xmlDoc.loadXML(xml);
    }

    return xmlDoc.childNodes[0].attributes;
};

CIB.checkBoolFromString = function (value) {
    returnValue = false;
    if (value) {
        if (value.toLowerCase() === "true") {
            returnValue = true;
        }
    }
    return returnValue;
};