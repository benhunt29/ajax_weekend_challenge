var clientID = 'fcd7a2de24b7d6c928fa183f79e8446e';
var clientSecret = 'd3179e92b5569c1735d30d2114cc7e9f';
var userSearchString = '/users/?q=';
var tracksSearchString = '/tracks?q=';
var userIDSearchString = '/users/';
var trackIDSearchString = '/tracks/';

function searchTemplateGet(data){
	    $.ajax({
	        url: 'searchTemplate.html', 
	        type: 'GET',
	        dataType: 'html',
	        success: function(response){
				var source   = response;
			    var template = Handlebars.compile(source);
			    $('.content').html(template(data));

			},
	        error: function(request, errorType, errorMessage){
	            alert(errorType + " " + errorMessage);
	        }
	    });
	};	

Handlebars.registerHelper('userTable', function(object) {
  if(object[0].track_count){
  	return true;
  }else{
  	return false;
  }

});

// Use this function to do stuff with your results. 
// It is called after 'search' is executed.
function searchCallback(data,searchType,idSearch) {	
	if(idSearch){
		//if ID Search, only construct the Soundcloud player 
		console.log(data.uri)
		$('#soundCloud').append('<iframe class="iframe" id = "soundcloudElement" width="100%" height="465" scrolling="no" frameborder="no">');
  		$('.iframe').attr('src',src = 'https://w.soundcloud.com/player/?url='+data.uri);

  	}else{

		//construct the table, but only return first 50 results
		if (data.length>50){
			data = data.slice(1,50);
		}

		var content = $('#results');
		var $newDiv = $('<div>');		
		var $newP = $('<p>');
		
			// searchType = userSearchString;
			searchTemplateGet(data);
	}	
}

$(document).ready(function() {
	
	var $selectedItem;
	//perform search of Soundcloud API
	$('#go').on('click', function(e){
		var query = $('#search').val();
		var searchType = $('#searchType').val();
		search(query,searchType);
	});

	//highlight row on click
	$('body').on('click','tr',function(){
		$(this).toggleClass('highlightedRow');
		$selectedItem = $(this);
		console.log(($selectedItem.parent().parent().attr('id')));

	});

	//create SoundCloud widget based on ID of currently highlighted row
	$('#openSoundCloudPlayer').on('click',function(){
		
		var query = [];
			console.log($selectedItem);
			query = $selectedItem.children().last().text();
			console.log(query);
		//var searchType = $('#searchType').val();
		var searchType = ($selectedItem.parent().parent().attr('id'));
		console.log(searchType);
		search(query,searchType,true);
	})

	//add to favorites table
	$('#addToFavorites').on('click',function(){
		var searchType = $('#searchType').val();
		var $highlightedRow = $selectedItem.children();
		var $newRow = $('<tr>');
		var $favoriteUsers = $('#favoriteUsers').children().last();
		var $favoriteTracks = $('#favoriteTracks').children().last();

		//decide whether to add to Users table or Tracks table
		if(searchType=='User'){
			$favoriteUsers.append($newRow);
			var $addedRow = $favoriteUsers.children().last();
			$addedRow.append($highlightedRow);
		}else{
			$favoriteTracks.append($newRow);
			var $addedRow = $favoriteTracks.children().last();
			$addedRow.append($highlightedRow);
		}
	});




});

function search(query,searchType,idSearch){
	var queryTypeString;

	//format search string based on Track search or User search
	if(searchType == 'Track' || searchType == 'favoriteTracks'){
		//if ID is searched, modify string to return object with specific ID
		if(idSearch){
			queryTypeString = trackIDSearchString + query + '?';
		}else{
			queryTypeString = tracksSearchString + query + '&'
		}

	}else{
		//if ID is searched, modify string to return object with specific ID
		if(idSearch){
			queryTypeString = userIDSearchString + query + '?';
		}else{
			queryTypeString = userSearchString + query;
		}
	};

	//AJAX call to SoundCloud API
	var jqxhr = $.ajax ({
		type: 'GET',
		dataType: 'json',
		crossDomain: true,
		url: 'http://api.soundcloud.com' + queryTypeString + '&' + 'client_id='+ clientID
	}).always(function() {
			console.log('Ajax attempt complete.');
			//console.log('http://api.soundcloud.com' + queryTypeString + encodeURI(query) + '&' + 'client_id='+ clientID);
		}).done(function(data, textStatus, jqXHR) {
			console.log(data);
			searchCallback(data,searchType,idSearch);
		}).fail(function(jqXHR, textStatus, errorThrown) {
			console.log('Ajax failed: ', textStatus);
		});

		// Set another completion function for the request above
		// You can set multiple always, done and fail functions like this
	jqxhr.always(function(){
		console.log('Still complete!');
	});
	
}