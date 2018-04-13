//var ajax = new XMLHttpRequest();

function Network(){
this.rooms = new Array();

this.addRoom = function(roomId){
this.rooms[this.rooms.length] = new Room(roomId);
}
}

function Room(roomId){ 
this.roomId = roomId;
this.computers = new Array();

this.addComputer = function(computerId, state){
this.computers[this.computers.length] = new Computer(computerId, state);
}
}

function Computer(computerId, state){ 
this.computerId = computerId;
this.state = state;
this.isChange = true;

this.changeState = function(newState){
this.state = newState;
}
}

var NetworkUniversity = new Network();

function generateRoom(Room){
	var table = document.createElement('table');
	
	var tr = document.createElement('tr');
	for(var i = 0; i < Room.computers.length; i++) {

		var td = document.createElement('td');
			
		if(!Room.computers[i].isChange)
			td.innerHTML = "<img src='compGrey.jpg'/>";
		
		if(Room.computers[i].state == "online")
			if(Room.computers[i].isChange)
				td.innerHTML = "<img src='compGreen.jpg'/>";
			
		if(Room.computers[i].state == "offline")
			if(Room.computers[i].isChange)
				td.innerHTML = "<img src='compRed.jpg'/>";
		
						
		    tr.appendChild(td);
					
			table.appendChild(tr);
	}
	table.classList.add('table');	
	return table;
	}
	
function getData(){
	alert('in function');
	var valueOne = document.getElementById("rooms").value;
	alert(valueOne);

	var arrayRooms = Array();

	var event = {	
		status: "offline",
		serialNumber: "id37n1",
		networkId: "37"
	  };

	arrayRooms[arrayRooms.length] = event;

	event = {
		status: "online",
		serialNumber: "id37n2",
		networkId: "37"
	  };

	arrayRooms[arrayRooms.length] = event;

	var str = JSON.stringify(arrayRooms);
	//alert( str ); // {"title":"Конференция","date":"сегодня"}

	event = JSON.parse(str);

	alert( event[0]['computerId'] ); // {"title":"Конференция","date":"сегодня"}

	//take data

	dealWithNewData(event);
}

function dealWithNewData(res){
	
	if(NetworkUniversity.rooms.length == 0)
		NetworkUniversity.addRoom(res[0]['networkId']);
	
	var flag = false;
		
	for(var i = 0; i<res.length; i++){
		flag = false;
		for(var j = 0; j < NetworkUniversity.rooms.length; j++){
			if(res[i]['networkId'] == NetworkUniversity.rooms[j]['roomId']){				
				flag = true;				
			}
		}
		if(!flag)
		{
			NetworkUniversity.addRoom(res[i]['networkId']);
			
		}
	}	
		
		for(var i = 0; i < NetworkUniversity.rooms.length; i++){
			if(NetworkUniversity.rooms[i].computers.length > 0){
				NetworkUniversity.rooms[i].computers.forEach(function(element){
					element.isChange = false;
				});
			}
		}
		
		for(var i = 0; i<res.length; i++){
			flag = false;
			for(var j = 0; j < NetworkUniversity.rooms.length; j++){
				
				if(res[i]['networkId'] == NetworkUniversity.rooms[j].roomId){
					if(NetworkUniversity.rooms[j].computers.length == 0){
						NetworkUniversity.rooms[j].addComputer(res[i]['serialNumber'], res[i]['status']);
					}
					else{					
						NetworkUniversity.rooms[j].computers.forEach(function(element) {
							if(res[i]['serialNumber'] == element.computerId){
								flag = true;
								element.state = res[i]['status'];
								element.isChange = true;
							}
						});
						
						if(!flag)
							NetworkUniversity.rooms[j].addComputer(res[i]['serialNumber'], res[i]['status']);					
					}
				}				
			}			
		}

		gets2();	
			
}

function gets2(){

	var contentTable = document.getElementById("content");
	
	var selectedRoom = document.getElementById("rooms").value;
	
	var flag = false;
	for(var i = 0; i < NetworkUniversity.rooms.length; i++){
	
		if(selectedRoom == NetworkUniversity.rooms[i].roomId)
		{			
			flag = true;
			
			contentTable.innerHTML = '';
			contentTable.appendChild(generateRoom(NetworkUniversity.rooms[i]));
			
		}		
	}
	if(!flag)
			contentTable.innerHTML = 'not exist';	
		
	updateSelectList();
		
}

function updateSelectList(){
	var newGet = document.getElementById("rooms");
	newGet.innerHTML = '';
	
	for(var j = 0; j < NetworkUniversity.rooms.length; j++){	
		var newOption = document.createElement('option');
		newOption.innerHTML = NetworkUniversity.rooms[j].roomId;
		newGet.appendChild(newOption);
	}		
}