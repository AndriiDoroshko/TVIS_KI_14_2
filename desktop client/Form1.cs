using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

using static TVIS.SocketClient;

namespace TVIS
{
    public partial class SystemTray : Form
    {
        private System.Windows.Forms.NotifyIcon notifyIcon1;
        private System.Windows.Forms.ContextMenu contextMenu1;
        private System.Windows.Forms.MenuItem menuItem1;
        private System.Threading.Thread myThread;

        public SystemTray()
        {
            InitializeComponent();
            Initialize_Controls();
            SocketClient.InitializeClient();
        }

        private void Initialize_Controls()
        {
            // 
            // button1
            // 
            //this.button1 = new System.Windows.Forms.Button();
            //this.button1.Location = new System.Drawing.Point(115, 125);
            //this.button1.Name = "button1";
            //this.button1.Size = new System.Drawing.Size(75, 23);
            //this.button1.TabIndex = 0;
            //this.button1.Text = "Start";
            //this.button1.UseVisualStyleBackColor = true;
            //this.Controls.Add(this.button1);
            //this.button1.Click += new System.EventHandler(this.button1_Click);

            this.components = new System.ComponentModel.Container();
            this.notifyIcon1 = new System.Windows.Forms.NotifyIcon(this.components);
            this.contextMenu1 = new System.Windows.Forms.ContextMenu();
            this.menuItem1 = new System.Windows.Forms.MenuItem();

            // Initialize contextMenu1
            this.contextMenu1.MenuItems.AddRange(
                        new System.Windows.Forms.MenuItem[] { this.menuItem1 });

            // Initialize menuItem1
            this.menuItem1.Index = 0;
            this.menuItem1.Text = "E&xit";
            this.menuItem1.Click += new System.EventHandler(this.menuItem1_Click);

            // Set up how the form should be displayed.
            this.ClientSize = new System.Drawing.Size(292, 266);
            this.Text = "Notify Icon Example";
            // The Icon property sets the icon that will appear
            // in the systray for this application.
            notifyIcon1.Icon = new Icon("monitor.ico");

            // The ContextMenu property sets the menu that will
            // appear when the systray icon is right clicked.
            notifyIcon1.ContextMenu = this.contextMenu1;

            // The Text property sets the text that will be displayed,
            // in a tooltip, when the mouse hovers over the systray icon.
            notifyIcon1.Text = "Form1 (NotifyIcon example)";
            notifyIcon1.Visible = true;

            // Handle the DoubleClick event to activate the form.
            notifyIcon1.DoubleClick += new System.EventHandler(this.notifyIcon1_DoubleClick);

            this.Move += new System.EventHandler(this.SystemTray_Move);

            this.Size = new Size(300, 300);
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            
        }

        private void notifyIcon1_DoubleClick(object Sender, EventArgs e)
        {
            // Show the form when the user double clicks on the notify icon.

            // Set the WindowState to normal if the form is minimized.
            if (this.WindowState == FormWindowState.Minimized)
                this.WindowState = FormWindowState.Normal;

            // Activate the form.
            this.Show();
        }

        private void menuItem1_Click(object Sender, EventArgs e)
        {
            myThread.Abort();
            SocketClient.ShutdownClient();
            this.Close();
        }

        private void SystemTray_Move(object Sender, EventArgs e)
        {
            if (this.WindowState == FormWindowState.Minimized)
            {
                this.Hide();
                notifyIcon1.ShowBalloonTip(1000, "Important", "Something", ToolTipIcon.Info);
            }

        }

        private async void button1_Click(object sender, EventArgs e)
        {
            myThread = new System.Threading.Thread(new System.Threading.ThreadStart(SocketClient.sendJsonData));
            myThread.Start();
        }

        private void button2_Click(object sender, EventArgs e)
        {
            ClassNumber = textBox1.Text;
        }

        private void label1_Click(object sender, EventArgs e)
        {

        }

        private void textBox1_TextChanged(object sender, EventArgs e)
        {

        }
    }
}
