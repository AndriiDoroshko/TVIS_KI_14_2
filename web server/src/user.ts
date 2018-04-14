export class User {

    status: Status;
    serialNumber: string;
    networkId: number;

    constructor(status: Status, serialNumber: string, networkId: number) {
      this.status = status;
      this.serialNumber = serialNumber;
      this.networkId = networkId;
    }

    toJSON(): UserJSON { return Object.assign({}, this, {
                                status: this.status.toString(),
                                serialNumber: this.serialNumber.toString(),
                                networkId: this.networkId.toString()});
  }

  static fromJSON(json: UserJSON|string): User {
     if (typeof json === 'string') { 
            return JSON.parse(json, User.reviver);
    } else {
      let user = Object.create(User.prototype);
      return Object.assign(user, json, { status: new String(json.status),
                                         serialNumber: new String(json.serialNumber),
                                         networkId: new Number(json.networkId)
      });
    }
  }

  static reviver(key: string, value: any): any {
    return key === "" ? User.fromJSON(value) : value;
  }

}

  export enum Status { 
    online = "online",
    offline = "offline"
   };

   interface UserJSON {
    status: Status;
    serialNumber: string;
    networkId: number;
   }