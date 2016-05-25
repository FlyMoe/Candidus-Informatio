//modal triggers

$(document).on('click','.modal-trigger',function(){


	if($(this).data("target") == "modal1")
	{
		var searchPage = $(this).data("repname");
		$.getJSON('http://en.wikipedia.org/w/api.php?action=parse&page='+ searchPage+ '&prop=text&format=json&callback=?', function(json) { 
			console.log(json);
    	var printDiv = $('<div>').html(json.parse.text['*']); 
    	$(printDiv).find('img').attr("src", function(){
    			var src = $(this).attr("src");
    			return ('https:' + src);
    	});
    	$(printDiv).find(".hatnote").remove();
    	$(printDiv).find(".vertical-navbox").remove();
    	$("#wikiInfo").html(printDiv);
    	//$("#wikiInfo").find("a:not(.references a)").attr("href", function(){ return "http://www.wikipedia.org" + $(this).attr("href");}); 
    	//$("#wikiInfo").find("a").attr("target", "_blank"); 
  });
	}

	//if the #submitAddress modal is hit get address to be confirmed by user
	if($(this).data("target") == "modal2")
	{
		//do quick ajax query to ensure address is correct
		//Empty the previously displayed address info
		$("#userAddress").empty();
		//API url call info
		var url = 'https://www.googleapis.com/civicinfo/v2/representatives?';
		var apiKey = 'key=AIzaSyBYo9BM0LkbN7SIHRGcQOGrG8bhCJFW3B4';
		var addressValue = $("#addressInput").val();
		var address = "&address=" + addressValue;

		var queryURL = url + apiKey + address;
		//Ajax call to retreive info
		$.ajax({url: queryURL, method: 'GET'}).done(function(response) {
			//Shortcut variables assigned so that data calls are truncated
			var addressResponse = response.normalizedInput;
			$("#userAddress").append(addressResponse.line1+ "<br>" + addressResponse.city + " " + addressResponse.state + " " + addressResponse.zip);
		});
	}

	// the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
	$('.modal-trigger').leanModal();
});



//When user confirms address
$("#commenceQuery").on("click" , function(){
//Empty the previously displayed representative info
$("#repInfo").empty();	

//API url call info
var url = 'https://www.googleapis.com/civicinfo/v2/representatives?';
var apiKey = 'key=AIzaSyBYo9BM0LkbN7SIHRGcQOGrG8bhCJFW3B4';
var addressValue = $("#addressInput").val();
var address = "&address=" + addressValue

var queryURL = url + apiKey + address;
//Ajax call to retreive info
$.ajax({url: queryURL, method: 'GET'}).done(function(response) {
	//list and list item which will contain query response
	var list = $("<ul>").attr("class", "collection with-header");
	var listItemHeader = $("<li>");
	console.log(response);
	//Shortcut variables assigned so that data calls are truncated
	var office = response.offices;
	var official = response.officials;

	//Main header for list
	$(listItemHeader).attr("class", "collection-header listHeader");
	$(listItemHeader).append("<h4>Representatives</h4>");
	$(list).append(listItemHeader);
	
	//for each office in the results
	for(var i = 0; i<office.length; i++ )
	{
		//list item which will contain query response
		var listItemOffice = $("<li>");
		//for each itteration set class back to header
		$(listItemOffice).attr("class", "collection-header officeHeader");
		//pushes headers for office names
		$(listItemOffice).append('<h4>' + office[i].name + '</h4>');
		$(list).append(listItemOffice);
		//for each individual who holds that office
		for(var j = 0; j< office[i].officialIndices.length; j++)
		{
			var listItemRep = $("<li>");
			//sets list item elements to collection items
			$(listItemRep).attr("class", "collection-item avatar modal-trigger");
			//enables each item to load larger modal with detailed info
			$(listItemRep).attr("href", "#modal1");
			//target data
			$(listItemRep).attr("data-target", "modal1");
			//saves representatives name for wiki search
			$(listItemRep).attr("data-repname", official[office[i].officialIndices[j]].name );
			//image and img properties for each representative
			var img = $("<img>"); 
			// we can add a responsive image effect if we want
			$(img).attr("src", official[office[i].officialIndices[j]].photoUrl);
			$(img).css("max-height", "200px");
			$(listItemRep).append(img);
			//span and span properties for each representative's name
			var span = $("<span>").attr("class", "title repHeader");
			$(span).append('<br>' + official[office[i].officialIndices[j]].name);
			$(listItemRep).append(span);

			if (official[office[i].officialIndices[j]].party == "Democratic") {
				// alert("hello");
				$(listItemRep).append('<img id="demo" src="assets/images/DemocraticLogo.png">' + "<br>");
				} else if (official[office[i].officialIndices[j]].party == "Republican") {
					$(listItemRep).append('<img id="rep" src="assets/images/republicanlogo.jpg">' + "<br>");
				}
			//p and p properties for each representative party, other info
			// var p = $("<p>").text("Party: " + official[office[i].officialIndices[j]].party);// + "<br>Website: " + official[office[i].officialIndices[j]].urls[0] );
			// $(listItemRep).append(p);
			// adding font awesome icons to candidate
			$(listItemRep).append('<a id="faceIcon" href="http://www.facebook.com" target="_blank"><i class="fa fa-facebook-square fa-2x" aria-hidden="true"></i></a>');
			$(listItemRep).append('<a id="twitterIcon" href="http://www.twitter.com" target="_blank"><i class="fa fa-twitter-square fa-2x" aria-hidden="true"></i>');
			$(listItemRep).append('<a id="youTubeIcon" href="http://www.youtube.com" target="_blank"><i class="fa fa-youtube-play fa-2x" aria-hidden="true"></i>');

			$(list).append(listItemRep);
		}
	}
	//adds entire list to div
	$("#repInfo").append(list);
});
});


