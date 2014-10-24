using System;
using System.Security.Permissions;
using Microsoft.SharePoint;
using Microsoft.SharePoint.Utilities;
using Microsoft.SharePoint.Workflow;

namespace CIB.AutoTitle.ServerCode.Receivers.CustomListReceiver
{
    /// <summary>
    /// List Item Events
    /// </summary>
    public class CustomListReceiver : SPItemEventReceiver
    {
        /// <summary>
        /// An item was added.
        /// </summary>
        public override void ItemAdded(SPItemEventProperties properties)
        {
            base.ItemAdded(properties);
        }

        /// <summary>
        /// An item was updated.
        /// </summary>
        public override void ItemUpdated(SPItemEventProperties properties)
        {
            this.EventFiringEnabled = false;
            base.ItemUpdated(properties);
            try
            {
                var t = properties.List.RootFolder.CIBFilterProperties("CIB.TitleMask");


                var test = properties.List.RootFolder.CIBGetProperty("CIB.TitleMask");
                var res = properties.ListItem.DataByMask(test);
                var Field = properties.ListItem.ParentList.Fields.TryGetFieldByStaticName("Title");
                if (Field != null)
                {
                    properties.ListItem[Field.Id] = res;
                    properties.ListItem.Update();
                }
            }
            finally
            {
                this.EventFiringEnabled = true;
            }

        }


    }
}