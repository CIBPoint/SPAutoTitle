var CIB = CIB || {};


CIB.AutoTitle = function () {
    var _self = this;
    var _DOM = {};
    var _context = {};
    var stdJSLink = "clienttemplates.js";
    var customReadonlyLink = '~site/SiteAssets/CIBAssets/AutoTitle/js/cib.title.csr.js';
    var propertyName = "CIB.TitleMask";
    var dateFormatName = "CIB.DateFormat";
    var availableTypes = ["text", "note"];
    

    this._init = function () {

        ExecuteOrDelayUntilScriptLoaded(function () {
            SP.SOD.registerSod('cib.static', _spPageContextInfo.webServerRelativeUrl + '/SiteAssets/CIBAssets/AutoTitle/js/cib.static.js');
            SP.SOD.executeFunc('cib.static', null, function () {
                CIB.ensureMQuery(function () {
                    _self._fillStandardParams();
                    _self.firstLoadData();
                });

            });
        }, 'sp.js');

    };

    this._parseInternalName = function(InternalName) {
        if (InternalName.indexOf('[') == 0) {
            InternalName = InternalName.substring(1, InternalName.length);
        }
        if (InternalName.indexOf(']') == (InternalName.length - 1)) {
            InternalName = InternalName.substring(0, InternalName.length - 1);
        }

        return InternalName;
    };

    this.maskForm = function (message) {
        if (_DOM.table) {
            _DOM.formElements.forEach(function (el, i, a) {
                m$(a[i]).attr("disabled", "disabled");
            });
            _DOM.link.style.display = "none";
        }
        if (SP.UI.Notify) {
            var notification = SP.UI.Notify.addNotification(message, false);
        }
        return notification;
    };

    this.unMask = function (notification) {
        if (_DOM.table) {
            _DOM.formElements.forEach(function (el, i, a) {
                a[i].removeAttribute("disabled");
            });

            _DOM.link.style.display = "inline";
        }
        if (notification) {
            SP.UI.Notify.removeNotification(notification);
        }
    };

    this.reuseContext = function () {
        if (!_context.ClientContext) {
            _context.clientContext = new SP.ClientContext();
            _context.web = _context.clientContext.get_web();

            _context.lists = _context.web.get_lists();
            _context.targetList = _context.lists.getById(_DOM.listId);
            _context.fields = _context.targetList.get_fields();
            _context.rootFolder = _context.targetList.get_rootFolder();
            _context.props = _context.rootFolder.get_properties();
        }

    };

    this._fillStandardParams = function () {
        _DOM.listId = CIB.urlParam("List");

        _DOM.table = m$("#FormTable");
        _DOM.formElements = _DOM.table.find("input, textarea, select");

        _DOM.link = m$("#CIBAddLink")[0];
        _DOM.selectedValue = m$("#CIBFieldsValue")[0];

        _DOM.selectedValue.ondblclick = _self.addFieldToTemplate;
        _DOM.link.onclick = _self.addFieldToTemplate;
        _DOM.template = m$("#CIBTemplateValue")[0];
        _DOM.required = m$("#CIBRequired")[0];
        _DOM.newEditForm = m$("#CIBNewEditForm")[0];
        _DOM.displayForm = m$("#CIBDisplayForm")[0];
        _DOM.readOnly = m$("#CIBReadOnly")[0];
        _DOM.dateFormatField = m$("#CIBDateFormat")[0];
        _DOM.fieldSelect = m$("#CIBFieldSelect")[0];
        _DOM.saveButton = m$("#onetidSaveItem")[0];
        _DOM.saveButton.onclick = _self.saveData;
        

        $addHandler(_DOM.fieldSelect, 'change', this.anotherLoadData);
    };

    this.addFieldToTemplate = function () {
        var fldselected = TrimSpaces(GetSelectedValue(_DOM.selectedValue));
        _DOM.template.value = _DOM.template.value + fldselected;
    };

    this.firstLoadData = function () {
        _self.reuseContext();
        _context.clientContext.load(_context.fields);
        _context.clientContext.load(_context.rootFolder);
        _context.clientContext.load(_context.props);

        _context.clientContext.executeQueryAsync(
            _self._firstLoadData_Success,
            _self._LoadData_Exception
        );
    };

    this._firstLoadData_Success = function (sender, args) {
        var selectedField = "";

        var fields = _context.fields.getEnumerator();

        while (fields.moveNext()) {
            var field = fields.get_current();
            var option = String.format('<option value="[{0}]">{1} ({0})</option>', field.get_internalName(), field.get_title());

            m$(_DOM.selectedValue).append(option);
            if ((availableTypes.indexOf(field.get_typeAsString().trim().toLowerCase()) != -1)
            && (!field.get_readOnlyField())) {
                m$(_DOM.fieldSelect).append(option);
                if (selectedField == "") {
                    selectedField = field.get_internalName();
                }
            }
            if (field.get_internalName().toLowerCase() == selectedField.toLowerCase()) {
                _context.selectedField = field;
                _self._fillFieldData(_context.selectedField);
            }
        }
        _self.unMask(_self.notify);
    };

    this._LoadData_Exception = function (sender, args) {
        alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
    };


    this.anotherLoadData = function () {
        _self.maskForm("Ждите!");

        var inValue = _DOM.fieldSelect.value;
        if (inValue) {
            inValue = _self._parseInternalName(inValue);

            
            _self.reuseContext();
            _context.selectedField = _context.fields.getByInternalNameOrTitle(inValue);
            _context.clientContext.load(_context.selectedField);
            _context.clientContext.load(_context.props);

            _context.clientContext.executeQueryAsync(
                _self._anotherLoadData_Success,
                _self._LoadData_Exception
            );
        }

    };
    
    this._anotherLoadData_Success = function (sender, args) {

        _self._fillFieldData(_context.selectedField);
        _self.unMask(_self.notify);
    };


    this._fillFieldData = function (field) {

        var allProperties = _context.props.get_fieldValues();
        var propValue = allProperties[field.get_internalName() + "_" + propertyName];
        if (propValue) {
            _DOM.template.value = propValue;
        } else {
            _DOM.template.value = "";
        }
        

        var dateFormatValue = allProperties[field.get_internalName() + "_" + dateFormatName];
        if (dateFormatValue) {
            _DOM.dateFormatField.value = dateFormatValue;
        } else {
            _DOM.dateFormatField.value = "dd.MM.yyyy HH:mm:ss";
        }


        var fieldAttrs = CIB.parseFieldXml(field.get_schemaXml());

        var jslink = field.get_jsLink();
        _DOM.required.checked = field.get_required();
        var readonly = false;
        if (jslink.toLowerCase() != stdJSLink) {
            readonly = true;
        }
        _DOM.readOnly.checked = readonly;
        _DOM.newEditForm.checked = !CIB.checkBoolFromString(CIB.parseFieldAttr(fieldAttrs["ShowInNewForm"]));
        _DOM.displayForm.checked = !CIB.checkBoolFromString(CIB.parseFieldAttr(fieldAttrs["ShowInDisplayForm"]));
    };

    this.saveData = function() {
        _self.maskForm("Ждите!");
        var selectedFieldName = _DOM.fieldSelect.value;
        if (selectedFieldName) {

            selectedFieldName = _self._parseInternalName(selectedFieldName);

            _self.reuseContext();
            _context.selectedField = _context.fields.getByInternalNameOrTitle(selectedFieldName);

            _context.props.set_item(selectedFieldName + "_" + propertyName, _DOM.template.value);
            _context.props.set_item(selectedFieldName + "_" + dateFormatName, _DOM.dateFormatField.value);

            _context.rootFolder.update();
            _context.selectedField.set_required(_DOM.required.checked);
            
            var link = stdJSLink;
            if (_DOM.readOnly.checked) {
                link = customReadonlyLink;
            }
            _context.selectedField.set_jsLink(link);

            _context.selectedField.setShowInNewForm(!_DOM.newEditForm.checked);
            _context.selectedField.setShowInEditForm(!_DOM.newEditForm.checked);

            _context.selectedField.setShowInDisplayForm(!_DOM.displayForm.checked);

            _context.selectedField.update();

            _context.clientContext.load(_context.props);
            _context.clientContext.load(_context.rootFolder);

            _context.clientContext.executeQueryAsync(
                function () {
                    _self.unMask(_self.notify);
                },
                _self._LoadData_Exception
            );
        }
    };

    this._init();
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
        //});
    }

    SP.SOD.notifyScriptLoadedAndExecuteWaitingJobs(scriptLink);
})();