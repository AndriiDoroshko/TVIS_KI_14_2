export class User {

  ip: string;
  mac: string;
  name: string;
  class_number: string;
  lastUpdate: number[];
  state: string = ""

    constructor(ip: string, mac: string, name: string, class_number: string) {
      this.ip = ip;
	  	this.mac = mac;
		  this.name = name;
      this.class_number = class_number;

     
      var today = new Date();
      var hh = today.getHours();
      var mm = today.getMinutes(); //January is 0!

      this.lastUpdate = [hh,mm];
      this.setStatus()
    }

    setStatus() {
      var isMinutesAreFresh = this.lastUpdate[1] >= (new Date().getMinutes() - 5) && this.lastUpdate[1] <= (new Date().getMinutes() + 5);

      if (this.lastUpdate[0] == new Date().getHours() && isMinutesAreFresh ) {
        this.state = "online";
      } else {
        this.state = "offline";
      }
    }
}

