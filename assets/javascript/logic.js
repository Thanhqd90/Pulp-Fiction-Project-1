$(document).ready(function () {
    // add parallax theme
    $('.parallax').parallax();

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyB2VCD1HecsHeNm0svNtWC2dJ5mUz7X0Lg",
        authDomain: "classapp-7477b.firebaseapp.com",
        databaseURL: "https://classapp-7477b.firebaseio.com",
        projectId: "classapp-7477b",
        storageBucket: "classapp-7477b.appspot.com",
        messagingSenderId: "360629441836"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    console.log("Houston, we have code!");
    console.log(firebase);

    $('.fixed-action-btn').floatingActionButton();


    $(".dropdown-trigger").dropdown();

    $(document.body).on("click", "#add-vid", function (event) {
        event.preventDefault();

        // scroll to search results
        $('html, body').animate({
            scrollTop: $("#results").offset().top
        }, 1000);

        // Both ajax calls can use the same input variable, 'searchData'.
        var searchData = $("#vid-input").val().trim();
        console.log(searchData);

        var wikiContent;

        // Won't do anything if 'vid-input' is empty.
        if (searchData !== "") {

            // Wiki AJAX section.
            var wikiQueryURL = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + searchData + "&limit=4&format=json";

            $.ajax({
                url: wikiQueryURL,
                dataType: "jsonp",
                success: function (wiki) {

                    console.log(wiki);

                    var wikiData = wiki[2];

                    // Pass content to a global variable, 'wikiContent'.
                    wikiContent = wikiData;

                    var wikiDiv = $("<div class='wikiData'>");

                    wikiDiv.append(`
                            <div class="col s12 m7">
                                <div class="card horizontal">
                                    <div id="wikiText">
                                    <ul>
                                        <li>${wikiData[0]}</li><br>
                                        <li>${wikiData[1]}</li><br>
                                        </ul>
                                    </div>
                                </div>
                            </div>`);
                    $("#wikiCont").html(wikiDiv);
                    $("#vid-input").val("");
                }
            });

            // Youtube AJAX section.
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

                //  Empty the video div ' vid-view' if it's occupied.
                $("#vid-view").empty();
                for (var i = 0; i < 5; i++) {

                    // JSON path.
                    var vidTitle = item[i].snippet.title;
                    var vidURL = item[i].id.videoId;

                    // Append embedded videos inside of a cards with template literals.
                    newDiv.append(`
                        <div class="col s12 m6">
                            <div class="card center grey darken-4">
                                <div class="card-content white-text">
                                    <span class="card-title">${vidTitle}</span>
                                    <div class="resp-container">
                                        <iframe class="resp-iframe" src="https://www.youtube.com/embed/${vidURL}" gesture="media"  allow="encrypted-media" allowfullscreen></iframe>
                                    </div>
                                </div>
                                <div class="card-action">
                                    <button id="${vidURL}" class="btn like-button waves-effect waves-light light-blue" type="submit" name="action">Like this video: <i class="far fa-thumbs-up"></i></button>
                                    <button id="${vidURL}" class="btn like-button waves-effect waves-light red" type="submit" name="action">Likes:  0</button>
                                </div>
                            </div>
                        </div>`);

                    $("#vid-view").append(newDiv);

                    var vLikes = database.ref("vids/" + vidURL);

                    vLikes.set({
                        likes: false
                    });
                }




            });

            $(document).on("click", ".like-button", function (event) {
                event.preventDefault();

                var btnId = event.target.id;
                console.log(btnId);

                var vLikesUp = database.ref("vids/" + btnId + "/");
                console.log("This is what we are looking for" + btnId);

                setTimeout(function () {

                    vLikesUp.set({
                        likes: true
                    });

                }, 500);
                $('.like-button').text("liked");
            });

            database.ref().on("value", function (snapshot) {

                // Then we console.log the value of snapshot
                console.log(snapshot.val());

                // Then we change the html associated with the number.
                //$(".like-count0").text(snapshot.val().likeCount);
                //$(".like-count1").text(snapshot.val().likeCount);
                //$(".like-count2").text(snapshot.val().likeCount);
                // $(".like-count3").text(snapshot.val().likeCount);
                //$(".like-count4").text(snapshot.val().likeCount);

                //likeCounter = snapshot.val().likes;
            }, function (errorObject) {

                // In case of error this will print the error
                console.log("The read failed: " + errorObject.code);
            });

            // Event to download the Wiki content in a plaint text document.
            $(document).on("click", "#btn-archive", function (event) {
                event.preventDefault();
                download(wikiContent, searchData + ".txt", "text/plain");
            });
        }
    });
});