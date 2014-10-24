<%-- _lcid="1049" _version="15.0.4420" _dal="1" --%>
<%-- _LocalBinding --%>
<%@ Page language="C#" MasterPageFile="~masterurl/default.master"    Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage,Microsoft.SharePoint,Version=15.0.0.0,Culture=neutral,PublicKeyToken=71e9bce111e9429c" meta:webpartpageexpansion="full" meta:progid="SharePoint.WebPartPage.Document"  %>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> <%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> <%@ Import Namespace="Microsoft.SharePoint" %> <%@ Assembly Name="Microsoft.Web.CommandUI, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> <%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<asp:Content ID="Content1" ContentPlaceHolderId="PlaceHolderPageTitle" runat="server">
	<SharePoint:ListItemProperty ID="ListItemProperty1" Property="BaseName" maxlength="40" runat="server"/>    
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderId="PlaceHolderAdditionalPageHead" runat="server">
	<meta name="GENERATOR" content="Microsoft SharePoint" />
	<meta name="ProgId" content="SharePoint.WebPartPage.Document" />
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="CollaborationServer" content="SharePoint Team Web Site" />
	<SharePoint:ScriptBlock ID="ScriptBlock1" runat="server">
	var navBarHelpOverrideKey = "WSSEndUser";             

    ExecuteOrDelayUntilScriptLoaded(function () {
        SP.SOD.registerSod('cib.core', _spPageContextInfo.webServerRelativeUrl + '/SiteAssets/CIBAssets/AutoTitle/js/cib.core.js');
        SP.SOD.executeFunc('cib.core', null, function(){});
    }, 'sp.js');   

	</SharePoint:ScriptBlock>
<SharePoint:StyleBlock ID="StyleBlock1" runat="server">
body #s4-leftpanel {
	display:none;
}
.s4-ca {
	margin-left:0px;
}
</SharePoint:StyleBlock>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderId="PlaceHolderSearchArea" runat="server">
	<SharePoint:DelegateControl ID="DelegateControl1" runat="server"
		ControlId="SmallSearchInputBox"/>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderId="PlaceHolderPageDescription" runat="server">
	<SharePoint:ProjectProperty ID="ProjectProperty1" Property="Description" runat="server"/>
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderId="PlaceHolderMain" runat="server">
	<div>
    <!-- START Form to edit Settings-->  
        <p><a href="#" onclick="if(typeof(window.frameElement) != 'undefined' &amp;&amp; window.frameElement != null) { window.frameElement.cancelPopUp(); return false;} if (window.history.length > 0) { window.history.back(); return false;} else { return false;}"><< Вернуться назад к настройкам списка</a></p> 
	<table border="0" width="100%" cellspacing="0" cellpadding="0" class="ms-v4propertysheetspacing" id="FormTable">
		<td class="ms-authoringcontrols" id="onetidDefaultTextValue1">
			<table border="0" cellspacing="1">
			    <tr nowrap="nowrap">
			        <td colspan="2" class="ms-propertysheet"><label>Текстовое поле подстановки:</label><br/>
                        <select name="CIBFieldSelect" id="CIBFieldSelect"></select>
			        </td>
                </tr>
				<tr nowrap="nowrap">
					<td class="ms-propertysheet"> <label>Шаблон:</label></td>  
                    <td class="ms-propertysheet"> <label>Вставить столбец:</label></td>
				</tr>
				<tr nowrap="nowrap">
					<td class="ms-propertysheet" nowrap="nowrap" style="vertical-align: top;">
					    <textarea class="ms-formula" name="CIBTemplate" rows="8" cols="24" id="CIBTemplateValue" dir="ltr" disabled></textarea>
					</td>
					<td>
						<select name="CIBFields" size="10" id="CIBFieldsValue" disabled>

						</select>
					</td>
				</tr>
                <tr nowrap="nowrap">
				    <td>&nbsp;</td>
				    <td class="ms-propertysheet" nowrap="nowrap" align="right">
					    <a href="javascript:;" id="CIBAddLink" style="display: none;">Добавить в шаблон</a>
					</td>
				</tr>
			</table>
		 </td><td>
	</td></tr>
		<tr>
		    <td class="ms-authoringcontrols"><label>Формат даты</label><br/>
				<table border="0" cellspacing="1">
					<tr>
						<td colspan="2">
							<input class="ms-input" type="text" id="CIBDateFormat" value="" disabled/>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	<tr>
        <tr>
		<td valign="top" class="ms-formlabel">
		    <input type="checkbox" id="CIBRequired" title="Требовать обязательное заполнение" disabled />Требовать обязательное заполнение названия
		</td>
	    </tr>
        <tr>
		<td valign="top" class="ms-formlabel">
		    <input type="checkbox" id="CIBReadOnly" title="Название доступно только на чтение" disabled />Название доступно только на чтение
		</td>
	    </tr>
        <tr>
		<td valign="top" class="ms-formlabel">
		    <input type="checkbox" id="CIBNewEditForm" title="Скрыть название из формы создания/изменения" disabled />Скрыть название из формы создания/изменения
		</td>
	    </tr>
        <tr>
		<td valign="top" class="ms-formlabel">
		    <input type="checkbox" id="CIBDisplayForm" title="Скрыть название из формы отображения" disabled />Скрыть название из формы отображения
		</td>
	    </tr>

        <!-- Кнопки -->
<tr><td>
		<input class="ms-ButtonHeightWidth" id="onetidSaveItem" accesskey="O" type="button" value="ОК" onclick="javascript:;" disabled>
		<span id="idSpace" class="ms-SpaceBetButtons"></span>
		<input class="ms-ButtonHeightWidth" id="onetidCancelItem" accesskey="c" type="button" value="Отмена" disabled onclick="if(typeof(window.frameElement) != 'undefined' &amp;&amp; window.frameElement != null) { window.frameElement.cancelPopUp(); return false;} if (window.history.length > 0) { window.history.back(); return false;} else { return false;}">

</td> </tr> 
	</table>	        
    <!-- END Form to edit Settings-->   
	<WebPartPages:WebPartZone runat="server" title="loc:TitleBar" id="TitleBar" AllowLayoutChange="false" AllowPersonalization="false" Style="display:none;"><ZoneTemplate>
	

	</ZoneTemplate></WebPartPages:WebPartZone>
  </div>
  <table class="ms-core-tableNoSpace ms-webpartPage-root" width="100%">
				<tr>
					<td id="_invisibleIfEmpty" name="_invisibleIfEmpty" valign="top" width="100%"> 
					<WebPartPages:WebPartZone runat="server" Title="loc:FullPage" ID="FullPage" FrameType="TitleBarOnly"><ZoneTemplate></ZoneTemplate></WebPartPages:WebPartZone> </td>
				</tr>
				<SharePoint:ScriptBlock ID="ScriptBlock2" runat="server">if(typeof(MSOLayout_MakeInvisibleIfEmpty) == "function") {MSOLayout_MakeInvisibleIfEmpty();}</SharePoint:ScriptBlock>
		</table>
</asp:Content>
