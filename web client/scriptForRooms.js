class Computer {

	constructor(ipAdress, mac, state, roomId) {
		this.ipAdress = ipAdress;
		this.mac = mac;
		this.state = state;
		this.roomId = roomId;
		this.timestamp = Date.now();
	}
}

class Room {

	constructor(roomId) {
		this.roomId = roomId;
		this.pcArray = new Array();
	}

	addUniquePc(pc) {
		if(!this.hasPc(pc))
			this.add(pc);
	}

	add(pc) {
		this.pcArray.push(pc);
	}

	hasPc(pc) {
		var hasPc = false;

		this.pcArray.forEach(function(ourPc) {
			if(
					ourPc.ipAdress == pc.ipAdress
				&&	ourPc.mac == pc.mac
				&&	ourPc.state == pc.state
				&&	ourPc.roomId == pc.roomId
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

	getRoomById(roomId) {
		var room = null;

		this.roomsArray.forEach(function(ourRoom) {
			if(ourRoom.roomId == roomId)
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

socket.onmessage = function(event) {
	stringWithPC = event.data;
};

socket.onopen = function() {
	socket.send('web');
}

function generateRoomHTML(room){
	
	var targetDiv = document.createElement('div');
	room.pcArray.forEach(function(pc) {

		var pcImg = "";
		
		if(pc.state == "online")
			pcImg = "green_computer.png";
		
		if(pc.state == "offline")
			pcImg = "red_computer.png";

		var compInfo  = "MAC address: " + pc.mac + "\nIP address: " + pc.ipAdress + "\nState: " + pc.state + "\nTimestamp: " + pc.timestamp;

		var span = document.createElement('span');

		span.innerHTML = "<div class='box'>\
						<img src='" + pcImg +"' height='150em' vspace='20em' hspace='20em' title='" + compInfo + "'/>\
						<h6 id='pcInfo'>" + pc.mac + "</h6>\
						<h6 id='pcInfo'>" + pc.ipAdress + "</h6>\
						<h6 id='pcInfo'>" + pc.state + "</h6>\
						<h6 id='pcInfo'>" + pc.timestamp + "</h6>\
						</div>";

		targetDiv.appendChild(span);
	});
		
	return targetDiv;
}
	
function getData(roomId) {
	if(socket.readyState != socket.OPEN) {
		alert("Problems with connection to server.\nTry again in a while.");
		return;
	}

	socket.send("web");
	
	if(stringWithPC.size == 0)
		return;

	fillNetworkData(JSON.parse(stringWithPC), roomId);

	generateNetworkHTML(roomId);
}

function fillNetworkData(arrayWithPc, roomId){

	arrayWithPc.forEach(function(pc) {
		
		var pcRoom = null;
		
		var pcRoomNotFound = true;

		// fill unknow rooms
		networkUniversity.roomsArray.forEach(function(room) {
			
			if( pc['roomId'] == room.roomId ) {
				pcRoom = room;
				pcRoomNotFound = false;
				return;
			}
		});

		if(pcRoomNotFound) {
			pcRoom = new Room(pc['roomId']);
			networkUniversity.add(pcRoom);			
		}

		pcRoom.addUniquePc(pc);
	});		
}

function generateNetworkHTML(roomId) {
	var displayTarget = document.getElementById("result");
	displayTarget.innerHTML = "";
	
	var header = document.createElement("H5");
	header.appendChild(document.createTextNode("Class room #" + roomId));   
	displayTarget.appendChild( header );
	
	var room = networkUniversity.getRoomById(roomId);
	if(room)
		displayTarget.appendChild(generateRoomHTML(room));
	
	var newGet = document.getElementById("rooms");
	newGet.innerHTML = '';

	networkUniversity.roomsArray.forEach(function(room) {
		var newOption = document.createElement('li');
		newOption.innerHTML =
			"<li class='nav-item'>\
				<a class='nav-link' href='javascript: getData("+room.roomId+")'>\
				<span data-feather='bar-chart-2'></span>"
				+ room.roomId +
				"</a>\
			</li>";
						
		newGet.appendChild(newOption);
	});
}