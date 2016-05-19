$("#submitAddress").on("click" , function(){

$("#userAddress").empty();
$("#repInfo").empty();	

var url = 'https://www.googleapis.com/civicinfo/v2/representatives?';
var apiKey = 'key=AIzaSyBYo9BM0LkbN7SIHRGcQOGrG8bhCJFW3B4';
var addressValue = $("#addressInput").val();
var address = "&address=" + addressValue

var queryURL = url + apiKey + address;

$.ajax({url: queryURL, method: 'GET'}).done(function(response) {

	console.log(response);

	var addressResponse = response.normalizedInput;
	var office = response.offices;
	var official = response.officials;
	$("#userAddress").append("Your address is: <br>" + addressResponse.line1+ "<br>" + addressResponse.city + ", " + addressResponse.state + " " + addressResponse.zip);

	$("#repInfo").append("----------------------Representatives------------------------<br><br>");
	for(var i = 0; i<office.length; i++ )
	{
		$("#repInfo").append("<b>Tite: " + office[i].name + "</b><br><br>");
		for(var j = 0; j< office[i].officialIndices.length; j++)
		{
			var img = $("<img>");
			$(img).attr("src", official[office[i].officialIndices[j]].photoUrl);
			$(img).css("max-height", "200px");
			$("#repInfo").append(img);
			$("#repInfo").append("<b>Name: " + official[office[i].officialIndices[j]].name + "</b><br><br>");
		}
		$("#repInfo").append("----------------------<br>");
	}
});

});