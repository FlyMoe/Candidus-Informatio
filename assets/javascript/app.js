

// Add disabled class to the search tabs.
// We only want the classes to show if we have search results.
$("li.tab").addClass("disabled");

var controler = {
	addressValue: null
};

//modal triggers

$(document).on('click','.modal-trigger',function(){


	if($(this).data("target") == "modal1")
	{
		var searchPage = $(this).data("repsearch");
		$.getJSON('http://en.wikipedia.org/w/api.php?action=parse&page='+ searchPage+ '&prop=text&format=json&callback=?', function(json) { 
			console.log(json);
    	var printDiv = $('<div>').html(json.parse.text['*']); 
    	$(printDiv).find('img').attr("src", function(){
    			var src = $(this).attr("src");
    			return ('https:' + src);
    	});
    	$(printDiv).find('a').replaceWith(function(){
    			var text = $(this).text();
    			return text;
    	});

    	
    	$(printDiv).find(".hatnote").remove();
    	$(printDiv).find(".reference").remove();
    	$(printDiv).find(".nowrap").remove();
    	$(printDiv).find(".vertical-navbox").remove();
    	$(printDiv).find(".noprint").remove();
    	$("#wikiInfo").html(printDiv);
    	$("div[id*='toc']").nextUntil(removeEnd).remove();
    	$('#modal1').openModal();
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
		controler.addressValue = $("#addressInput").val();
		var address = "&address=" + controler.addressValue;

		var queryURL = url + apiKey + address;
		//Ajax call to retreive info
		$.ajax({url: queryURL, method: 'GET'}).done(function(response) {
			//Shortcut variables assigned so that data calls are truncated
			var addressResponse = response.normalizedInput;
			$("#userAddress").append(addressResponse.line1+ "<br>" + addressResponse.city + " " + addressResponse.state + " " + addressResponse.zip);
		});
		$('#modal2').openModal();
	}

});

//user filter
$(".tab").on("click" , function(){
	var filter = $(this).data("filter");
	getCivicData(filter);	

});


//When user confirms address
$("#commenceQuery").on("click" , function(){

	getCivicData("all");
	// We have data now, so remove the disabled class from the tabs
	$("li").removeClass("disabled");
	return false;
});
/*
function getArticles(candidateName) {
	console.log("candidateName: "+candidateName);
	// Split name
	var candidateNameArray = candidateName.split(" ");
	var firstName = candidateNameArray[0];
	var lastName = candidateNameArray[1];

	// Number of days to go back in time to get the articles
	var days = 3;

	// Richard API Key
	//var apiKey = "7fb6488ed8a21e2f195e86044da7b925de2c18c3";
	// Alex API Key
	var apiKey = "f0faba359d051da2cbcc649312e730f4722257f7";
	
	var queryURL = "https://gateway-a.watsonplatform.net/calls/data/GetNews?apikey="+apiKey+"&outputMode=json&start=now-"+days+"d&end=now&count=5&q.enriched.url.enrichedTitle.keywords.keyword.text="+firstName+"+"+lastName+"&return=enriched.url.url,enriched.url.title";
	
	$.ajax({
	        url: queryURL,
	        method: 'GET'
	    })           
	.done(function(response) {
		   	    
		for (var i = 0; i < response.result.docs.length; i++) {
			var url = response.result.docs[i].source.enriched.url.url;
	        var title = response.result.docs[i].source.enriched.url.title;
            var hostname = $('<a>').prop('href', url).prop('hostname');
	        var candidateDiv = $("#articles").append("<p><a href='"+url+"' target=\"_blank\">"+title+"</a></p>");              
		}
	});

	return false;   
}
*/
function getCivicData(filter)
{	

//API url call info
var url = 'https://www.googleapis.com/civicinfo/v2/representatives?';
var apiKey = 'key=AIzaSyBYo9BM0LkbN7SIHRGcQOGrG8bhCJFW3B4';
var address = "&address=" + controler.addressValue;

var queryURL = url + apiKey + address;
//Ajax call to retreive info
$.ajax({url: queryURL, method: 'GET'}).done(function(response) {
	//list and list item which will contain query response
	list = $("<ul>").attr("class", "collection with-header");
	var listItemHeader = $("<li>");
	console.log(response);
	//Shortcut variables assigned so that data calls are truncated
	var division = response.divisions;
	console.log(division);
	var office = response.offices;
	var official = response.officials;
	//Main header for list
	$(listItemHeader).attr("class", "collection-header listHeader");
	$(listItemHeader).append("<h4>Representatives</h4>");
	$(list).append(listItemHeader);
	//for each division in the results
	$.each(division, function(key,value)
	{
		console.log(key);
		console.log(value);

		if(filter == "federal")
		{
			if(value.name != "United States")
				return;
		}
		else if(filter == "state")
		{
			if(value.name != "Florida")
				return;
		}
		else if (filter == "local")
		{
			if(value.name == "Florida" || value.name == "United States")
				return;
		}
		else
		{

		}

		//for each office in the results
		for(var i = 0; i<value.officeIndices.length; i++ )
		{
			console.log(office[value.officeIndices[i]]);
			console.log(value.officeIndices[i]);
			//list item which will contain query response
			var listItemOffice = $("<li>");
			//for each itteration set class back to header
			$(listItemOffice).attr("class", "collection-header officeHeader center");
			//pushes headers for office names
			$(listItemOffice).append('<h4>' + office[value.officeIndices[i]].name + '</h4>');
			$(list).append(listItemOffice);
			//for each individual who holds that office
			for(var j = 0; j< office[value.officeIndices[i]].officialIndices.length; j++)
			{
				console.log(official[office[value.officeIndices[i]].officialIndices[j]]);
				console.log(office[value.officeIndices[i]].officialIndices[j]);
				var listItemRep = $("<li>");
				//sets list item elements to collection items
				$(listItemRep).attr("class", "collection-item avatar modal-trigger card-panel hoverable");
				//enables each item to load larger modal with detailed info
				$(listItemRep).attr("href", "#modal1");
				//target data
				$(listItemRep).attr("data-target", "modal1");
				//saves representatives name for wiki search
				//if()
				//{
				$(listItemRep).attr("data-repsearch", official[office[value.officeIndices[i]].officialIndices[j]].name );
				console.log(official[office[value.officeIndices[i]].officialIndices[j]].name);
				//}
				//else
				//{
				//	$(listItemRep).attr("data-repSearch", official[office[i].officialIndices[j]].name + " " + response.normalizedInput.state. + " politician");
				//}
				//image and img properties for each representative
				var img = $("<img>");
				$(img).attr("src", official[office[value.officeIndices[i]].officialIndices[j]].photoUrl);
				$(img).css("max-height", "200px");
				$(listItemRep).append(img);
				//span and span properties for each representative's name
				var span = $("<span>").attr("class", "title repHeader");
				$(span).append('<br>' + official[office[value.officeIndices[i]].officialIndices[j]].name);
				$(listItemRep).append(span);
				
				if ((official[office[value.officeIndices[i]].officialIndices[j]].party) == "Democratic")
				{
					$(listItemRep).append('<img id="demo" src="assets/images/DemocraticLogo.png">' + "<br>");
				}
				else if ((official[office[value.officeIndices[i]].officialIndices[j]].party) == "Republican")
				{
					$(listItemRep).append('<img id="rep" src="assets/images/republicanlogo.jpg">' + "<br>");
				}


				// adding font awesome icons to candidate
				$(listItemRep).append('<a id="faceIcon" href="http://www.facebook.com" target="_blank"><i class="fa fa-facebook-square fa-2x" aria-hidden="true"></i></a>');
				$(listItemRep).append('<a id="twitterIcon" href="http://www.twitter.com" target="_blank"><i class="fa fa-twitter-square fa-2x" aria-hidden="true"></i>');
				$(listItemRep).append('<a id="youTubeIcon" href="http://www.youtube.com" target="_blank"><i class="fa fa-youtube-play fa-2x" aria-hidden="true"></i>');


				$(list).append(listItemRep);

				//getArticles(official[office[value.officeIndices[i]].officialIndices[j]].name);
			}

		}
	});
	//Empty the previously displayed representative info
	$("#repInfo").empty();
	//adds entire list to div
	$("#repInfo").append(list);
});

}
