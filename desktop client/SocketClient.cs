using System;
using System.Net;
using System.Net.Sockets;
using System.Text;

using Newtonsoft.Json;

using System.Threading.Tasks;
using System.Net.NetworkInformation;
using System.Net.WebSockets;

using System.Threading;

namespace TVIS
{
    public class SocketClient
    {
        private static ClientWebSocket sender = null;
        private static readonly TimeSpan delay = TimeSpan.FromMilliseconds(30000);
        public static String ClassNumber;

        public static void InitializeClient()
        {
            try
            {
                sender = new ClientWebSocket();
                Uri serverUri = new Uri("ws://localhost:10000");
                sender.ConnectAsync(serverUri, CancellationToken.None);
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
            }
        }

        public static void ShutdownClient()
        {
            sender.CloseAsync(WebSocketCloseStatus.NormalClosure, "Done", CancellationToken.None);
        }

        public static async void sendJsonData()
        {
            try
            {
                while (sender.State == WebSocketState.Open)
                {
                    ArraySegment<byte> bytesToSend = new ArraySegment<byte>(Encoding.UTF8.GetBytes(GetSerializedInfo()));
                    sender.SendAsync(bytesToSend, WebSocketMessageType.Text, true, CancellationToken.None);
                    await Task.Delay(delay);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
            }
        }

        private static string GetSerializedInfo()
        {
            string macAddress = "";
            foreach (NetworkInterface nic in NetworkInterface.GetAllNetworkInterfaces())
            {
                if (nic.OperationalStatus == OperationalStatus.Up)
                {
                    macAddress += nic.GetPhysicalAddress().ToString();
                    break;
                }
            }

            string ipAddress = "";
            var host = Dns.GetHostEntry(Dns.GetHostName());
            foreach (var ip in host.AddressList)
            {
                if (ip.AddressFamily == AddressFamily.InterNetwork)
                {
                    ipAddress += ip.ToString();
                }
            }

            PCInfo pcinfo = new PCInfo();
            pcinfo.class_number = ClassNumber;
            pcinfo.mac = macAddress;
            pcinfo.ip = ipAddress;
            pcinfo.name = System.Environment.MachineName;

            return JsonConvert.SerializeObject(pcinfo);

        }

    }
}