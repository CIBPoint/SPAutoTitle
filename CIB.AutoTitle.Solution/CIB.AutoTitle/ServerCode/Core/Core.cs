using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.SharePoint;
using Microsoft.SharePoint.Utilities;


namespace CIB.AutoTitle.ServerCode
{
    public static class Core
    {
        public static string CIBGetProperty(this SPFolder SPObject, string PropertyName)
        {
            return (string)SPObject.GetProperty(PropertyName);
        }

        public static void CIBSetProperty(this SPFolder SPObject, string PropertyName, object PropertyValue)
        {
           SPObject.SetProperty(PropertyName, PropertyValue);
           SPObject.Update();
        }

        public static string DataByMask(this SPListItem Item, string Mask)
        {
            var resultString = "";
            int startIndex1 = 0;
            int startIndex2 = 0;
            var nList = new List<string>();

            var SubString = "";
            while (startIndex1 >= 0 && startIndex2 >= 0)
            {
                startIndex1 = Mask.IndexOf('[', startIndex2);

                if (startIndex1 < startIndex2) continue;

                if ((startIndex1 - startIndex2) > 1)
                {
                    var sub = 1;
                    if (startIndex2 == 0)
                    {
                        sub = 0;
                    }
                    SubString = Mask.Substring(startIndex2 + sub, startIndex1 - startIndex2 - sub);
                    //nList.Add(SubString);
                    resultString += SubString;
                }

                startIndex2 = Mask.IndexOf(']', startIndex1);

                if (startIndex2 <= startIndex1) continue;

                SubString = Mask.Substring(startIndex1 + 1, startIndex2 - startIndex1 - 1);

                var Field = Item.ParentList.Fields.TryGetFieldByStaticName(SubString);
                if (Field != null)
                {
                    //var Value = Item.GetFormattedValue(Field.InternalName);
                    var Value = Field.GetValidatedString(Item[Field.Id]);
                    resultString += Value;
                }
                //nList.Add(SubString);
            }
            return resultString;
        }


        public static Dictionary<string,string> CIBFilterProperties(this SPFolder SPObjects, string Filter)
        {
            var Fields = SPObjects.Properties
                .Cast<DictionaryEntry>()
                .Where(prop => prop.Key.ToString().IndexOf(Filter, System.StringComparison.Ordinal) != -1)
                .ToDictionary(
                    prop => prop.Key.ToString(), 
                    prop => prop.Value.ToString());
            return Fields;
        }

        //public static List<string> CIBFilterProperties(this SPFolder SPObjects, string Filter)
        //{

        //    var Fields = (from DictionaryEntry prop in SPObjects.Properties where prop.Key.ToString().StartsWith(Filter) select prop.Key.ToString()).ToList();
        //    return Fields;
        //}

    }
}
