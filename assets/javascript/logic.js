$(document).ready(function () {

// Initialize Firebase
var config = {
apiKey: "AIzaSyBUq710k0unXdSq00_TsSlTmLnmp6cA9BE",
authDomain: "pulp-functions.firebaseapp.com",
databaseURL: "https://pulp-functions.firebaseio.com",
projectId: "pulp-functions",
storageBucket: "pulp-functions.appspot.com",
messagingSenderId: "167017299988"
};
firebase.initializeApp(config);

var likeCounter = 0;

  console.log(firebase);

    $(".dropdown-trigger").dropdown();

    $(document.body).on("click", "#add-vid", function (event) {
        event.preventDefault();

        // Both ajax calls can use the same input (searchData).
        var searchData = $("#vid-input").val().trim();

        console.log(searchData);

        // Won't do anything if the search is empty.
        if (searchData !== "") {

            // Wiki ajax section.
            var wikiQueryURL = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + searchData + "&limit=4&format=json";

            // Create an AJAX call using jsonp to bypass CORS.
            $.ajax({
                url: wikiQueryURL,
                dataType: "jsonp",
                success: function (wiki) {

                    var wikiTitle = wiki[2];
                    var wikiDiv = $("<div class='wikiData'>");

                    console.log(wiki);

                    wikiDiv.append(`
                            <div class="col s12 m7">
                                <div class="card horizontal">
                                    <div id="wikiText">
                                        <p>${wikiTitle}</p>
                                    </div>
                                </div>
                            </div>`);
                    $("#wikiCont").html(wikiDiv);
                    $("#vid-input").val("");
                }
            });

            // Youtube ajax section.
            var apikey = "AIzaSyCWG4gCwFSmWaI4si9ItKsSBHtA80xMnEk";
            var tubeQueryURL = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=" + searchData + "type=video&fields=etag%2Citems%2Ckind%2CnextPageToken%2CpageInfo%2CregionCode&key=" + apikey;

            // Create an AJAX call to the YouTube API.
            $.ajax({
                url: tubeQueryURL,
                method: "GET"
            }).then(function (response) {
                var item = response.items;
                console.log(response);
                console.log(response.items);
                console.log(item[0].snippet);
                console.log(item[0].snippet.title);

                var newDiv = $("<div class='vid-results'>");

                $("#like-button").on("click", function() {

                    // Add to like count
                    likeCounter++;

                    //  Store like data in database
                    database.ref().set({
                      likeCount: likeCounter
                    });
                  });

                $("#vid-view").empty();
                for (var i = 0; i < 5; i++) {
                    // JSON path
                    var vidTitle = item[i].snippet.title;
                    var vidURL = item[i].id.videoId;
                    var vidDes = item[i].snippet.description;

                    // Append gifs inside of a card body with template literals
                    newDiv.append(`
                        <div class="col s12 m7">
                            <div class="card horizontal">
                                <div class="card-image">
                                    <iframe allow="fullscreen" width="450" height="300" src="https://www.youtube.com/embed/${vidURL}"></iframe>
                                </div>
                                <div class="card-stacked">
                                    <div class="card-content">
                                        <h6><strong>Title:</strong> ${vidTitle}</h6>
                                    <br>
                                        <p><strong>Description:</strong> ${vidDes}</p>
                                        <button class="btn waves-effect waves-light light-blue" type="submit" name="action">Like this video: <i class="far fa-thumbs-up"></i> ${likeCounter}</button>
                                        <button class="btn waves-effect waves-light pink accent-3" type="submit" name="action">Add to favorites: <i class="fas fa-heart"></i>
                                    </div>
                                </div>
                            </div>
                        </div>`);
                }
                $("#vid-view").append(newDiv);
            });
        }
    });
});
