var CIB = CIB || {};
CIB.Core = CIB.Core || {};
CIB.Const = CIB.Const || {};
CIB.PropertyName = "CIB.TitleMask";
CIB.DateFormatName = "CIB.DateFormat";
CIB.AvailableTypes = ["text", "note"];


CIB.FillStandardParams = function() {
    var ListId = CIB.UrlParam("List");
    var SelectedValue = m$("#CIBFieldsValue");
    var Template = m$("#CIBTemplateValue");
    var Required = m$("#CIBRequired");
    var NewEditForm = m$("#CIBNewEditForm");
    var DisplayForm = m$("#CIBDisplayForm");
    var ReadOnly = m$("#CIBReadOnly");
    var DateFormatField = m$("#CIBDateFormat");
    var FieldSelect = m$("#CIBFieldSelect");
};
CIB.AddFieldToTemplate = function() {
    var SelectedValue = m$("#CIBFieldsValue");
    var TemplateValue = m$("#CIBTemplateValue");

    if ((SelectedValue.length > 0) && (TemplateValue.length > 0)) {
        var fldselected = TrimSpaces(GetSelectedValue(SelectedValue[0]));
        TemplateValue[0].value = TemplateValue[0].value + fldselected;
    }
};

CIB.EnsureMQuery = function (fn) {
    EnsureScriptFunc('mQuery.js', 'm$', function() {
        if (fn)
            fn();
    });
};


CIB.UrlParam = function(name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
        return null;
    } else {
        return results[1] || 0;
    }
};


CIB.PageAfterLoad = function () {
    var Notify = CIB.MaskForm("Подождите, идет загрузка...");
    
    //CIBFieldSelect

    if (ListId) {       
        var clientContext = new SP.ClientContext();
        var web = clientContext.get_web();

        var lists = web.get_lists();
        var targetList = lists.getById(ListId);        
        var fields = targetList.get_fields();
        var rootFolder = targetList.get_rootFolder();
        var props = rootFolder.get_properties();
        
        clientContext.load(fields);
        clientContext.load(rootFolder);
        clientContext.load(props);


        clientContext.executeQueryAsync(function (sender, args) {
            var allValues = props.get_fieldValues();
            var PropValue = allValues[CIB.PropertyName];
            if ((PropValue) && (Template.length >0)) {
                Template[0].value = PropValue;
            }
            var DateFormatValue = allValues[CIB.DateFormatName];
            if (DateFormatValue) {
                DateFormatField[0].value = DateFormatValue;
            } else {
                DateFormatField[0].value = "dd.MM.yyyy HH:mm:ss";
            }
            
            var fieldsEnumerator = fields.getEnumerator();          

            while (fieldsEnumerator.moveNext()) {
                var field = fieldsEnumerator.get_current();
                var option = String.format('<option value="[{0}]">{1}</option>', field.get_staticName(), field.get_title() + " (" + field.get_staticName() + ")");
                SelectedValue.append(option);
                if ((CIB.AvailableTypes.indexOf(field.get_typeAsString().trim().toLowerCase()) != -1) 
                && (!field.get_readOnlyField())) {
                    console.log(field.get_readOnlyField());
                    FieldSelect.append(option);
                }
                if ((field.get_staticName().toLowerCase() == "title") && (Required.length > 0)) {
                    var FieldAttrs = CIB.ParseFieldXml(field.get_schemaXml());

                    var jslink = field.get_jsLink();
                    Required[0].checked = field.get_required();
                    var readonly = false;
                    if (jslink.toLowerCase() != "clienttemplates.js") {
                        readonly = true;
                    }
                    ReadOnly[0].checked = readonly;
                    NewEditForm[0].checked = !CIB.CheckBoolFromString(CIB.ParseFieldAttr(FieldAttrs["ShowInNewForm"]));
                    DisplayForm[0].checked = !CIB.CheckBoolFromString(CIB.ParseFieldAttr(FieldAttrs["ShowInDisplayForm"]));
                }
            }
            CIB.UnMask(Notify);
        }, function (sender, args) {
            alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
        });

    }    

};


CIB.SaveData = function () {
    var Notify = CIB.MaskForm("Подождите, идет загрузка...");
    var ListId = CIB.UrlParam("List");
    var SelectedValue = m$("#CIBTemplateValue");
    var Required = m$("#CIBRequired");
    var NewEditForm = m$("#CIBNewEditForm");
    var DisplayForm = m$("#CIBDisplayForm");
    var ReadOnly = m$("#CIBReadOnly");
    var DateFormatField = m$("#CIBDateFormat");

    if (ListId) {
        var clientContext = new SP.ClientContext();
        var web = clientContext.get_web();

        var lists = web.get_lists();
        var targetList = lists.getById(ListId);
        var fields = targetList.get_fields();
        var field = fields.getByInternalNameOrTitle("Title");
        var rootFolder = targetList.get_rootFolder();
        var props = rootFolder.get_properties();
        props.set_item(CIB.PropertyName, SelectedValue[0].value);
        props.set_item(CIB.DateFormatName, DateFormatField[0].value);
        
        rootFolder.update();
        if (Required.length > 0) {
            field.set_required(Required[0].checked);
        }
        if (ReadOnly.length > 0) {
            //set_jsLink
            var link = "clienttemplates.js";
            if (ReadOnly[0].checked) {
                link = '~site/SiteAssets/CIBAssets/AutoTitle/js/cib.title.csr.js';
            }
            field.set_jsLink(link);
        }
        if (NewEditForm.length > 0) {
            field.setShowInNewForm(!NewEditForm[0].checked);
            field.setShowInEditForm(!NewEditForm[0].checked);

        }
        if (DisplayForm.length > 0) {
            field.setShowInDisplayForm(!DisplayForm[0].checked);
        }
        field.update();
        
        clientContext.load(fields);
        clientContext.load(field);
        clientContext.load(rootFolder);

        clientContext.executeQueryAsync(function (sender, args) {
            //console.log(props.get_item(CIB.PropertyName));
            CIB.UnMask(Notify);
            
        }, function (sender, args) {
            alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
        });

    }
};

CIB.MaskForm = function (message) {
    var table = m$("#FormTable");
    if (table) {
        table.find("input, textarea, select").forEach(function (el, i, a) {
            m$(a[i]).attr("disabled", "disabled");
        });
        var link = m$("#CIBAddLink");
        if (link.length > 0) {
            link[0].style.display = "none";
        }
    }
    if (SP.UI.Notify) {
        var notification = SP.UI.Notify.addNotification(message, false);
    }
    return notification;
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

CIB.ParseFieldAttr = function(attr) {
    var returnValue = undefined;
    if (attr) {
        returnValue = attr.value;
    }
    return returnValue;
};

CIB.ParseFieldXml = function(xml) {
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

CIB.CheckBoolFromString = function(value) {
    returnValue = false;
    if (value) {
        if (value.toLowerCase() === "true") {
            returnValue = true;
        }
    }
    return returnValue;
};

(function () {
    var scriptLink = "~site/SiteAssets/CIBAssets/AutoTitle/js/cib.core.js";

    if (_spBodyOnLoadCalled) {
        init();
    } else {
        _spBodyOnLoadFunctions.push(init);
    }

    function init() {
        SP.SOD.executeFunc("clientrenderer.js", "SPClientRenderer.ReplaceUrlTokens", function () {
            RegisterModuleInit(SPClientRenderer.ReplaceUrlTokens(scriptLink), init);
        });

        CIB.EnsureMQuery(CIB.PageAfterLoad);
    }

    SP.SOD.notifyScriptLoadedAndExecuteWaitingJobs(scriptLink);
})();
