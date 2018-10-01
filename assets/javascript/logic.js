$(document).ready(function() {

  // Function to display gifs with AJAX call
//   function displayVideo() {

//     var keyword = $("#vid-input").val().trim();


// }

$(document.body).on("click", "#add-vid", function (event) {
    event.preventDefault();
    
    var apikey = "AIzaSyCWG4gCwFSmWaI4si9ItKsSBHtA80xMnEk";
    var keyword = $("#vid-input").val().trim();
    var queryURL = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=" + keyword + "type=video&fields=etag%2Citems%2Ckind%2CnextPageToken%2CpageInfo%2CregionCode&key=" + apikey;
    
    if (keyword === "") {
      return keyword;
    }

    // Create an AJAX call
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (response) {
      console.log(response)
      
              console.log(response.kind);
              console.log(response[0].items.snippet.description);
              console.log(response[0].items.snippet.thumbnails.default.url);
    })
  });
});

