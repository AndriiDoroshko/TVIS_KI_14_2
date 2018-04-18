//import { debug } from "util";
class Computer {

	constructor(ip, mac, name, class_number, status) {
		this.ip = ipAdress;
		this.mac = mac;
		this.name = state;
		this.class_number = roomId;
		this.status = status;
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
			if(ourPc.mac == pc.mac) {
				ourPc.ipAdress = pc.ipAdress
				ourPc.state = pc.state
				ourPc.roomId = pc.roomId
				hasPc = true;
				return;
			}
		});

		return hasPc;
	}
}

class Network {

	constructor() {
		this.currentRoom = 0
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
var newData = "";

function generateRoomHTML(room){
	
	var targetDiv = document.createElement('div');
	room.pcArray.forEach(function(pc) {

		var pcImg = "";
		
		if(pc.state == "online")
			pcImg = "green_computer.png";
		
		if(pc.state == "offline")
			pcImg = "red_computer.png";

		var span = document.createElement('span');
		span.innerHTML = "<img src='" + pcImg +"' height='150em' vspace='20em' hspace='20em'/>";
		targetDiv.appendChild(span);
	});
		
	return targetDiv;
}

window.setInterval(function(){
	
	$.get( "Computer.txt", function(data){
	newData = JSON.parse(data);
	console.log(newData);
	});
	console.log(newData);
	if (newData != stringWithPC) {
		stringWithPC = newData;
	}
	if (networkUniversity.currentRoom != 0) {
	reload(networkUniversity.currentRoom);
	}
}, 1000);

function getData(roomId) {
	
	reload(roomId);
}

function reload(roomId) {

	let PSs = Array.from(stringWithPC)
	console.log(PSs);
	if (PSs.length == null && PSs.length == undefined) {
		return;
	}

	fillNetworkData(PSs, roomId);
	generateNetworkHTML(roomId);
}

function fillNetworkData(arrayWithPc, roomId){

	arrayWithPc.forEach(function(pc) {
		
		var pcRoom = null;
		var pcRoomNotFound = true;

		console.log(pc);
		// fill unknow rooms
		networkUniversity.roomsArray.forEach(function(room) {
			
			if( room.class_number == pc['class_number']) {
				pcRoom = room;
				room.currentRoom = roomId;
				pcRoomNotFound = false;
				return;
			}
		});

		if(pcRoomNotFound) {
			pcRoom = new Room(pc['class_number']);
			networkUniversity.add(pcRoom);			
		}

		pcRoom.
		addUniquePc(pc);
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