// Coding reference has been taken from the demo provided by the professor in class lectures.
(function($){
	//console.log('js loaded....');
	//creating database
	var database;
     //database open request
	var openRequest = indexedDB.open("notelist",1);
	openRequest.onupgradeneeded = function(e) {
		console.log("Upgrading DATABASE...");
		var thisDB = e.target.result;
		if(!thisDB.objectStoreNames.contains("noteliststore")) {
			thisDB.createObjectStore("noteliststore", { autoIncrement : true });
		}
	}
	openRequest.onsuccess = function(e) {
		console.log("Open Success!");
		database = e.target.result;
		var name = document.getElementById('nameList').value;
			
		document.getElementById('add-btn').addEventListener('click', function(){
			// add note button on click function
			var name = document.getElementById('nameList').value;

			var sub = document.getElementById('subjectList').value;
		    var text = document.getElementById('textList').value;
            // input validation
		   if(name == '' && sub == '' && text == ''){
		    	 swal({   title: "Please fill up all the text fields.",   text: "Thankyou.",   imageUrl: "images/warning.png" });
		    }

		    else if(sub == '' && text == ''){
		    	 swal({   title: "Please enter subject and message fields.",   text: "Thankyou.",   imageUrl: "images/warning.png" });
		    }
		     else if(name == '' && sub == ''){
		    	 swal({   title: "Please enter name and subject.",   text: "Thankyou.",   imageUrl: "images/warning.png" });
		    }
		    else if(name == '' && text == ''){
		    	 swal({   title: "Please enter name and message.",   text: "Thankyou.",   imageUrl: "images/warning.png" });
		    }
		    else if(name == ''){
		    	swal({   title: "Hey, Please enter valid name.",   text: "Thankyou.",   imageUrl: "images/warning.png" });
		    }

          else if(sub == ''){
		    	 swal({   title: "Please enter subject.",   text: "Thankyou.",   imageUrl: "images/warning.png" });
		    }

		    else if(text == ''){
		    	 swal({   title: "Please enter message.",   text: "Thankyou.",   imageUrl: "images/warning.png" });
		    }
		    
		    
			
			else if (!name.trim()) {
				
        		//empty
        	} else {
        	addNote();
        	//addSubject(subject);
        	//addWord(text);

        	}
        });noteList();
	}
	openRequest.onerror = function() {
		console.log("Open Error!");
		console.dir(e);
	}

	function addNote() {
		//fetching data from database
		var transaction = database.transaction(["noteliststore"],"readwrite");
		var store = transaction.objectStore("noteliststore");
		var name = document.getElementById('nameList').value;
		var sub = document.getElementById('subjectList').value;
		var text = document.getElementById('textList').value;
		var date = new Date();
		console.log('adding ' +name );

          // storing data
		var request = store.add({
			name,
			sub,
			text,
			date
		});

             
		request.onerror = function(e) {
			console.log("Error",e.target.error.name);
	        //some type of error handler
	    }
	    request.onsuccess = function(e) {
	    	
	    	console.log("added " + name);
	    	noteList();
	    	document.getElementById('nameList').value = '';
	    	document.getElementById('subjectList').value = '';
	    	document.getElementById('textList').value = '';
	    	                            
	    }
	              
	}


	function noteList(){
		$('#viewDetails').empty();
		$('#viewDetails').html('<table class="table table-hover"><tr><th>Key</th><th>Text</th></tr></table>');

		//Count Objects
		var transaction = database.transaction(['noteliststore'], 'readonly');
		var store = transaction.objectStore('noteliststore');

		//var care = addName.store.request.result.date;

		var countRequest = store.count();
		//console.log(countRequest.result);

		countRequest.onsuccess = function(){ 

			console.log(countRequest.result);
             // displaying all the notes added to the database in table
            $('#viewDetails').html('</br><table><caption><h3>VIEW NOTE(S)&nbsp;<img src="images/view.png"/></h3></caption><thead><tr><th colspan="4">TOTAL' +'  ( '+countRequest.result+' ) '+'NOTES &nbsp;<img src="images/square.png"/></th></tr><tr><th> ID<img src="images/key.png"/></th><th>SUBJECT&nbsp;<img src="images/paper.png"/></th><th>DATE&nbsp;<img src="images/clock.png"/></th><th>COUNT&nbsp;<img src="images/hand.png"/></th></tr></thead></table>');

		 };

		// Get all Objects
		var objectStore = database.transaction("noteliststore").objectStore("noteliststore");
		objectStore.openCursor().onsuccess = function(event) {
			var cursor = event.target.result;
			if (cursor) {
				var $link = $('<button class="btn btn-warning" href="#" data-key="' + cursor.key + '">' + cursor.value.sub + '&nbsp;<img src="images/arrow.png"/></button>');
				$link.click(function(){
					//alert('Clicked ' + $(this).attr('data-key'));
					loadTextByKey(parseInt($(this).attr('data-key')));
				});
				// displaying all the notes added to the database by appending it to the view notes table 
				var $row = $('<tr> The no of notes is :' +IDBRequest.result+'</tr>');
				var $keyCell = $('<tbody><tr><td> ID '+cursor.key+'</td>');				
				var $textCell = $('<td></td>').append($link);
				var $data= $('<td>' + cursor.value.date +'</td>');
				var $count = $('<td> ' +cursor.value.text.length + ' characters </td>');
				$row.append($keyCell);
				$row.append($textCell);
				$row.append($data);
				$row.append($count);
				$('#viewDetails table').append($row);
				cursor.continue();
			}
			else {
			    //no more entries
			}
		};
	}

	function loadTextByKey(key){
		var transaction = database.transaction(['noteliststore'], 'readonly');
		var store = transaction.objectStore('noteliststore');
		var request = store.get(key);
				
			request.onerror = function(event) {
		  // Handle errors!
		};
		request.onsuccess = function(event) {

		 //Do something with the request.result!
		  
			console.log(request.result.date);

			
           // note details are shown (name,subject,message, date and message character count)
		  $('#noteDetails').html('<div id="corner"><p><h2>Hello' +' '+ '<font color="#6C2DC7">'+ request.result.name + '!</font></h2></p><p><font color="gray">Date: '+ ' '+request.result.date+ '</font></p><p><h3>Subject:' +' '+' <font color="1F45FC">'+ request.result.sub + ' </font></p><p>Message:'+' '+' <font color="#4CC552">' +request.result.text+'</font></h3></p><p>('+ ' '+request.result.text.length+'&nbsp; characters count )</p></div><br>');

             // delete button to delete the notes created
		  var $deleteButton = $('<center><button  class="btn btn-danger">Delete Note &nbsp;<img src="images/delete.png"/></button></center>');
		  $deleteButton.click(function(){
		  	console.log('Delete' + key);
		  	deleteWord(key);
		  });
		  $('#noteDetails').append($deleteButton);
		};
	}

	function deleteWord(key) {
		var transaction = database.transaction(['noteliststore'], 'readwrite');
		var store = transaction.objectStore('noteliststore');
		var request = store.delete(key);
		request.onsuccess = function(evt){
			noteList();
			$('#noteDetails').empty();
		};
	}

})(jQuery);