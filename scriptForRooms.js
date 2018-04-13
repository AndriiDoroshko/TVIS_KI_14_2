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
	
	var targetDiv = document.createElement('div');
	for(var i = 0; i < Room.computers.length; i++) {

		 var span = document.createElement('span');
			
		if(!Room.computers[i].isChange)
			 span.innerHTML = "<img src='green_computer.png' height='150em' vspace='20em' hspace='20em'/>";
		
		if(Room.computers[i].state == "online")
			if(Room.computers[i].isChange)
				 span.innerHTML = "<img src='green_computer.png' height='150em' vspace='20em' hspace='20em'/>";
			
		if(Room.computers[i].state == "offline")
			if(Room.computers[i].isChange)
				span.innerHTML = "<img src='red_computer.png' height='150em' vspace='20em' hspace='20em'/>";
		
		targetDiv.appendChild(span);
	}
		
	return targetDiv;
	}
	
function getData( valueOne ){
	

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
	
	event = {
		status: "online",
		serialNumber: "id39n2",
		networkId: "39"
	  };

	arrayRooms[arrayRooms.length] = event;

	var str = JSON.stringify(arrayRooms);

	event = JSON.parse(str);
	
	//take data

	dealWithNewData(event, valueOne);
}

function dealWithNewData(res, valueOne){
	
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

		gets2(valueOne);	
			
}

function gets2(selectedRoom){

	var displayTarget = document.getElementById("result");
    displayTarget.innerHTML = "";
	
	var header = document.createElement("H5");
    header.appendChild(document.createTextNode("Class room #" + selectedRoom));   
    displayTarget.appendChild( header );
	
	var flag = false;
	for(var i = 0; i < NetworkUniversity.rooms.length; i++){
	
		if(selectedRoom == NetworkUniversity.rooms[i].roomId)
		{			
			flag = true;
			
			displayTarget.appendChild(generateRoom(NetworkUniversity.rooms[i]));
			
		}		
	}
	if(!flag)
			displayTarget.innerHTML = 'not exist';	
		
	updateSelectList();
		
}

function updateSelectList(){
	var newGet = document.getElementById("rooms");
	newGet.innerHTML = '';
	
	for(var j = 0; j < NetworkUniversity.rooms.length; j++){	
		var newOption = document.createElement('li');
		var roomId = NetworkUniversity.rooms[j].roomId;
		 newOption.innerHTML = "<li class='nav-item'>\
                            <a class='nav-link' href='javascript: getData("+roomId+")'>\
                                <span data-feather='bar-chart-2'></span>"
                                + roomId+
                            "</a>\
                        </li>";
						
		newGet.appendChild(newOption);
	}		
}