/*Date.prototype.yyyymmddhhmm = function() {
	var yyyy = this.getFullYear();
	var mm = this.getMonth() < 9 ? "0" + (this.getMonth() + 1) : (this.getMonth() + 1); // getMonth() is zero-based
	var dd  = this.getDate() < 10 ? "0" + this.getDate() : this.getDate();
	var hh = this.getHours() < 10 ? "0" + this.getHours() : this.getHours();
	var min = this.getMinutes() < 10 ? "0" + this.getMinutes() : this.getMinutes();
	return "".concat(yyyy).concat(mm).concat(dd).concat(hh).concat(min);
   };
   */

class Computer {

	constructor(ip, mac, status, class_number) {
		this.ip = ip;
		this.mac = mac;
		this.name = name;
		this.status = status;
		this.class_number = class_number;
		this.timestamp = Date.now();
	}
}

class Room {

	constructor(class_number) {
		this.class_number = class_number;
		this.pcArray = new Array();
	}

	addUniquePc(pc) {
		if (!this.hasPc(pc))
			this.add(pc);
	}

	add(pc) {
		this.pcArray.push(pc);
	}

	hasPc(pc) {
		var hasPc = false;

		this.pcArray.forEach(function (ourPc) {
			if (
				ourPc.ip == pc.ip
				&& ourPc.mac == pc.mac
				&& ourPc.name == pc.name
				&& ourPc.class_number == pc.class_number
			) {
				hasPc = true;
				return;
			}
		});

		return hasPc;
	}
}

class Network {
	constructor() {
		this.roomsArray = new Array();
	}

	add(room) {
		this.roomsArray.push(room);
	}

	getRoomById(class_number) {
		
		var room = null;

		this.roomsArray.forEach(function (ourRoom) {
			if (ourRoom.class_number == class_number)
				room = ourRoom;
		});

		return room;
	}
}

// Global variable begin

var networkUniversity = new Network();
var stringWithPC = "";

var socket = new WebSocket("ws://localhost:10000");

// Global variables end

socket.onmessage = function (event) {
	console.log(event.data);
	stringWithPC = event.data;
};

socket.onopen = function () {
	socket.send('web');
}

function generateRoomHTML(room) {

	var targetDiv = document.createElement('div');
	room.pcArray.forEach(function (pc) {

		var pcImg = "";

		if (pc.status == "online")
			pcImg = "green_computer.png";

		if (pc.status == "offline")
			pcImg = "red_computer.png";

		var compInfo = "MAC address: " + pc.mac + "\nName: " + pc.name + "\nIP address: " + pc.ip + "\nstatus: " + pc.status + "\nTimestamp: " + pc.timestamp/*.yyyymmddhhmm()*/;

		var span = document.createElement('span');

		span.innerHTML = "<div class='box'>\
						<img src='" + pcImg + "' height='150em' vspace='20em' hspace='20em' title='" + compInfo + "'/>\
						<h6 id='pcInfo'>" + pc.mac + "</h6>\
						<h6 id='pcInfo'>" + pc.name + "</h6>\
						<h6 id='pcInfo'>" + pc.ip + "</h6>\
						<h6 id='pcInfo'>" + pc.status + "</h6>\
						<h6 id='pcInfo'>" + pc.timestamp/*.yyyymmddhhmm()*/ + "</h6>\
						</div>";

		targetDiv.appendChild(span);
	});

	return targetDiv;
}

function getData(class_number) {

	if( socket.readyState != socket.OPEN) {

		socket = new WebSocket("ws://localhost:10000");
	}

	socket.send("web");

	if (stringWithPC.size == 0)
		return;

	fillNetworkData(JSON.parse(stringWithPC), class_number);

	generateNetworkHTML(class_number);
}

function fillNetworkData(arrayWithPc, class_number) {


	arrayWithPc.forEach(function (pc) {

		var pcRoom = null;

		var pcRoomNotFound = true;

		// fill unknow rooms
		networkUniversity.roomsArray.forEach(function (room) {

			if (pc['class_number'] == room.class_number) {
				pcRoom = room;
				pcRoomNotFound = false;
				return;
			}
		});

		if (pcRoomNotFound) {
			pcRoom = new Room(pc['class_number']);
			networkUniversity.add(pcRoom);
		}

		pcRoom.addUniquePc(pc);
	});
}

function generateNetworkHTML(class_number) {
	var displayTarget = document.getElementById("result");
	displayTarget.innerHTML = "";

	var header = document.createElement("H5");
	header.appendChild(document.createTextNode("Class room #" + class_number));
	displayTarget.appendChild(header);

	var room = networkUniversity.getRoomById(class_number);
	if (room)
		displayTarget.appendChild(generateRoomHTML(room));

	// var newGet = document.getElementById("rooms");
	// newGet.innerHTML = '';

	// networkUniversity.roomsArray.forEach(function (room) {
	// 	var newOption = document.createElement('li');
	// 	newOption.innerHTML =
	// 		"<li class='nav-item'>\
	// 			<a class='nav-link' href='javascript: getData("+ room.class_number + ")'>\
	// 			<span data-feather='bar-chart-2'></span>"
	// 		+ room.class_number +
	// 		"</a>\
	// 		</li>";

	// 	newGet.appendChild(newOption);
	// });
}