var CIB = CIB || {};

CIB.propertyName = "CIB.TitleMask";
CIB.dateFormatName = "CIB.DateFormat";
CIB.availableTypes = ["text", "note"];

CIB.AutoTitle = function () {
    var _self = this;
    CIB.AutoTitle.prototype._controls = {};
    CIB.AutoTitle.prototype._context = {};
    
    CIB.AutoTitle.prototype.notify = null;
    // public
    CIB.AutoTitle.prototype.init = function () {
        
        ExecuteOrDelayUntilScriptLoaded(function () {
            SP.SOD.registerSod('cib.static', _spPageContextInfo.webServerRelativeUrl + '/SiteAssets/CIBAssets/AutoTitle/js/cib.static.js');
            SP.SOD.executeFunc('cib.static', null, function() {
                CIB.ensureMQuery(
                        SP.SOD.executeOrDelayUntilScriptLoaded(function () {
                            _self._fillStandardParams();
                            _self.firstLoadData();
                        }, "mquery.js")
                    );

            });
        }, 'sp.js');

    };

    CIB.AutoTitle.prototype.maskForm = function (message) {
        if (_self._controls.table) {
            _self._controls.formElements.forEach(function (el, i, a) {
                m$(a[i]).attr("disabled", "disabled");
            });
            _self._controls.link.style.display = "none";
        }
        if (SP.UI.Notify) {
            var notification = SP.UI.Notify.addNotification(message, false);
        }
        return notification;
    };

    CIB.AutoTitle.prototype.unMask = function (notification) {
        if (_self._controls.table) {
            _self._controls.formElements.forEach(function (el, i, a) {
                a[i].removeAttribute("disabled");
            });

            _self._controls.link.style.display = "inline";
        }
        if (notification) {
            SP.UI.Notify.removeNotification(notification);
        }
    };
    
    CIB.AutoTitle.prototype.reuseContext = function() {
        if (!_self._context.ClientContext) {
            _self._context.clientContext = new SP.ClientContext();
            _self._context.web = _self._context.clientContext.get_web();

            _self._context.lists = _self._context.web.get_lists();
            _self._context.targetList = _self._context.lists.getById(_self._controls.listId);
            _self._context.fields = _self._context.targetList.get_fields();
            _self._context.rootFolder = _self._context.targetList.get_rootFolder();
            _self._context.props = _self._context.rootFolder.get_properties();
        }

    };

    CIB.AutoTitle.prototype._fillStandardParams = function () {
        _self._controls.listId = CIB.urlParam("List");
        
        _self._controls.table = m$("#FormTable");
        _self._controls.formElements = _self._controls.table.find("input, textarea, select");
        
        _self._controls.link = m$("#CIBAddLink")[0];
        _self._controls.selectedValue = m$("#CIBFieldsValue")[0];

        _self._controls.selectedValue.ondblclick = _self.addFieldToTemplate;
        _self._controls.template = m$("#CIBTemplateValue")[0];
        _self._controls.required = m$("#CIBRequired")[0];
        _self._controls.newEditForm = m$("#CIBNewEditForm")[0];
        _self._controls.displayForm = m$("#CIBDisplayForm")[0];
        _self._controls.readOnly = m$("#CIBReadOnly")[0];
        _self._controls.dateFormatField = m$("#CIBDateFormat")[0];
        _self._controls.fieldSelect = m$("#CIBFieldSelect")[0];
    };

    CIB.AutoTitle.prototype.addFieldToTemplate = function () {
        var fldselected = TrimSpaces(GetSelectedValue(_self._controls.selectedValue));
        console.log(fldselected);
        _self._controls.template.value = _self._controls.template.value + fldselected;
    };

    CIB.AutoTitle.prototype.firstLoadData = function () {
        _self.reuseContext();
        _self._context.clientContext.load(_self._context.fields);
        _self._context.clientContext.load(_self._context.rootFolder);
        _self._context.clientContext.load(_self._context.props);

        _self._context.clientContext.executeQueryAsync(
            _self._firstLoadData_Success,
            _self._firstLoadData_Exception
        );
    };

    CIB.AutoTitle.prototype._firstLoadData_Success = function (sender, args) {
        var selectedField = "";
        var allProperties = _self._context.props.get_fieldValues();
        var propValue = allProperties[CIB.propertyName];
        if (propValue) {
            _self._controls.template.value =propValue;
        }
        
        var dateFormatValue = allProperties[CIB.dateFormatName];
        if (dateFormatValue) {
            _self._controls.dateFormatField.value = dateFormatValue;
        } else {
            _self._controls.dateFormatField.value = "dd.MM.yyyy HH:mm:ss";
        }

        var fields = _self._context.fields.getEnumerator();

        while (fields.moveNext()) {
            var field = fields.get_current();
            var option = String.format('<option value="[{0}]">{1}</option>', field.get_internalName(), field.get_title() + " (" + field.get_internalName() + ")");

            m$(_self._controls.selectedValue).append(option);
            if ((CIB.availableTypes.indexOf(field.get_typeAsString().trim().toLowerCase()) != -1)
            && (!field.get_readOnlyField())) {
                m$(_self._controls.fieldSelect).append(option);
                if (selectedField == "") {
                    selectedField = field.get_internalName();
                }
            }
            console.log(selectedField);
            if (field.get_internalName().toLowerCase() == selectedField.toLowerCase()) {
                console.log("1");
                _self._fillFieldData(field);
            }
        }
        _self.unMask(_self.notify);
    };
    
    CIB.AutoTitle.prototype._firstLoadData_Exception = function (sender, args) {
        alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
    };

    CIB.AutoTitle.prototype._fillFieldData = function(field) {
        var fieldAttrs = CIB.parseFieldXml(field.get_schemaXml());

        var jslink = field.get_jsLink();
        _self._controls.required.checked = field.get_required();
        var readonly = false;
        if (jslink.toLowerCase() != "clienttemplates.js") {
            readonly = true;
        }
        _self._controls.readOnly.checked = readonly;
        _self._controls.newEditForm.checked = !CIB.checkBoolFromString(CIB.parseFieldAttr(fieldAttrs["ShowInNewForm"]));
        _self._controls.displayForm.checked = !CIB.checkBoolFromString(CIB.parseFieldAttr(fieldAttrs["ShowInDisplayForm"]));
    };

    CIB.AutoTitle.prototype._fieldByStaticName = function(staticName) {
        var fields = _self._context.fields.getEnumerator();

        while (fields.moveNext()) {
            var field = fields.get_current();
            if (field.get_internalName().toLowerCase() == staticName.toLowerCase()) {
                _self._fillFieldData(field);
            }
        }
    };

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
        //CIB.EnsureMQuery(function() {
            var test = new CIB.AutoTitle();
            test.init();
        //});
    }

    SP.SOD.notifyScriptLoadedAndExecuteWaitingJobs(scriptLink);
})();