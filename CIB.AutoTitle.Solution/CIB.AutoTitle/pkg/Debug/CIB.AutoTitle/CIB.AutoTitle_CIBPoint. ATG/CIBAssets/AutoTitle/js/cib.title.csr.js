var CIB = CIB || {};
CIB.Controls = CIB.Controls || {};

CIB.Controls.TitleRendering = function () {   
    var TitleRenderer = {};
    TitleRenderer.Templates = {};

    TitleRenderer.Templates.Fields =
    {
        'Title': {
            'NewForm': this.RenderReadOnlyTitle,
            'EditForm': this.RenderReadOnlyTitle,
            'View': this.RenderReadOnlyTitle
        }
    };
    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(TitleRenderer);
    
    this.RenderReadOnlyTitle = function (ctx) {
        return "<span>" + ctx.CurrentFieldValue + "</span";
    };
};




(function () {
    CIB.Controls.TitleRendering();
})();