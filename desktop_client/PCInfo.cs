using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace TVIS
{
    public class PCInfo
    {
        [JsonProperty("ip")]
        public string ip { get; set; }

        [JsonProperty("mac")]
        public string mac { get; set; }

        [JsonProperty("name")]
        public string name { get; set; }

        [JsonProperty("class_number")]
        public string class_number { get; set; }
    }
}
