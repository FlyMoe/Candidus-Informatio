var tag = document.createElement('script');

      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      // 3. This function creates an <iframe> (and YouTube player)
      //    after the API code downloads.
      var player;
      function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
          height: '100%',
          width: '100%',
          playerVars: {
                    autoplay: 1,
                    disablekb:0,
                    controls: 0,
                    start: 20,
                    loop: 0,
                    controls: 0,
                    showinfo: 0,
                    autohide: 1,
                    modestbranding: 1,
                    vq: 'hd1080'},
          videoId: 'JQqLd_mM1KI',
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
      }

      // 4. The API will call this function when the video player is ready.
      function onPlayerReady(event) {
        event.target.playVideo();
        player.mute();
      }

      var done = false;
      function onPlayerStateChange(event) {
        
      }
      function stopVideo() {
        player.stopVideo();
      }

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
