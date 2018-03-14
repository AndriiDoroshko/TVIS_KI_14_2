(function(){
			const button33 = document.getElementsByClassName('button')[0];
			const button37 = document.getElementsByClassName('button')[1];
			const button39 = document.getElementsByClassName('button')[2];
			const contentTable = document.getElementById('content');
			
			const stateOfClass33 = [1,0,0,1,1,0,1,0]; //заглушка, массив с состояниями компьютеров в ауд. 33
			
			const stateOfClass37 = [0,1,1,0,0,1]; //заглушка, массив с состояниями компьютеров в ауд. 37
			
			const stateOfClass39 = [1,0,1]; //заглушка, массив с состояниями компьютеров в ауд. 39
			
			

			function generateClass ( stateOfPcArray ) {							
				const table = document.createElement('table');

				
					const tr = document.createElement('tr');
					for(let i = 0; i < stateOfPcArray.length; i++) {
						const td = document.createElement('td');
						
						if(stateOfPcArray[i])
							td.innerHTML = "<img src='compGreen.jpg'/>";
						else
							td.innerHTML = "<img src='compRed.jpg'/>";
						
						tr.appendChild(td);
					
					table.appendChild(tr);
				}

				table.classList.add('table');
				return table;
			}

						

			button33.addEventListener('click', () => {
				contentTable.innerHTML = '';
				
				contentTable.appendChild(generateClass(stateOfClass33));
			});
			
			button37.addEventListener('click', () => {
				contentTable.innerHTML = '';
				
				contentTable.appendChild(generateClass(stateOfClass37));
			});
			
			button39.addEventListener('click', () => {
				contentTable.innerHTML = '';
				
				contentTable.appendChild(generateClass(stateOfClass39));
			});
})();