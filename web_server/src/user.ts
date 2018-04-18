export class PCInfo {

    status: Status;
    ip: string;
    mac: string;
    name: string;
    class_number: string
    timestamp: Date;

    constructor(
      ip: string,
      mac: string,
      name: string,
      class_number: string
    ){
      this.status = Status.online;
      this.ip = ip;
      this.mac = mac;
      this.name = name;
      this.class_number = class_number;
      this.timestamp = new Date();
    }

    // toJSON(): UserJSON { 
    //   return Object.assign({}, this, {
    //                             status: this.status.toString(),
    //                             serialNumber: this.serialNumber.toString(),
    //                             networkId: this.networkId.toString()});
    // }

  static fromJSON(json: string): PCInfo {
    var user: PCInfo = JSON.parse(json);

    user.status = Status.online;
    user.timestamp = new Date();
    return user;
  }
}
  export enum Status { 
    online = "online",
    offline = "offline"
   };

   interface UserJSON {
    ip: string;
    mac: string;
    name: string;
    class_number: string
   }