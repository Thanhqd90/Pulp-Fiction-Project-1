$(document).ready(function () {

    /* Initialize Thanh's Firebase API. (Alternative)
    var config = {
        apiKey: "AIzaSyB2VCD1HecsHeNm0svNtWC2dJ5mUz7X0Lg",
        authDomain: "classapp-7477b.firebaseapp.com",
        databaseURL: "https://classapp-7477b.firebaseio.com",
        projectId: "classapp-7477b",
        storageBucket: "classapp-7477b.appspot.com",
        messagingSenderId: "360629441836"
    };

    firebase.initializeApp(config); */

    // Initialize Chris's Firebase API.
    var config = {
        apiKey: "AIzaSyCrKtFWtBgY5GMHypug24uzVVgCip8WRVY",
        authDomain: "wikitube-71d68.firebaseapp.com",
        databaseURL: "https://wikitube-71d68.firebaseio.com",
        projectId: "wikitube-71d68",
        storageBucket: "",
        messagingSenderId: "601189842667"
    };

    firebase.initializeApp(config);

    // Add parallax theme.
    $('.parallax').parallax();

    // Floating action button animation.
    $('.fixed-action-btn').floatingActionButton({
        direction: "left"
    });

    // Model trigger.
    $('.modal').modal();

    // Global variables.
    var db = firebase.database();
    var data;
    var urlKeys;
    var urlArray1 = [];
    var urlArray2 = [];

    $(document.body).on("click", "#add-vid", function (e) {
        e.preventDefault();

        // Video loader code.
        $("#loader").html("<div class='preloader-wrapper big active'><div class='spinner-layer spinner-blue-only'><div class='circle-clipper left'><div class='circle'></div></div><div class='gap-patch'><div class='circle'></div></div><div class='circle-clipper right'><div class='circle'></div> </div></div></div>");
        $("#vid-view").css("margin-bottom", "7.5%");

        // Both AJAX calls can use the same input variable, 'searchData'.
        var searchData = $("#vid-input").val().trim();

        // Local variable.
        var wikiContent;

        // Won't do anything if 'vid-input' is empty.
        if (searchData !== "") {

            // Wiki AJAX section.
            var wikiQueryURL = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + searchData + "&limit=4&format=json";

            $.ajax({
                url: wikiQueryURL,
                dataType: "jsonp",
                success: function (wiki) {

                    // Local variable.
                    var wikiData = wiki[2];

                    // Pass content to a global variable, 'wikiContent'.
                    wikiContent = wikiData;

                    var wikiDiv = $("<div class='wikiData'>");

                    if (wikiContent.length === 0) {
                        $('#vid-input').attr('placeholder', 'No results found');
                        $("#vid-view").empty();
                        wikiDiv.hide();

                        // Set a (2.5) second delay.
                        setTimeout(function () {

                            $('#vid-input').attr('placeholder', 'Search anything');

                        }, 2500);
                    };

                    // Set a (1.5) second delay.
                    setTimeout(function () {

                        // Scroll to search results.
                        $('html, body').animate({
                            scrollTop: $("#results").offset().top
                        }, 1000);

                        wikiDiv.append(`
                        <div class="col s12 m7">
                            <div class=" wiki-color card horizontal blue darken-4">
                                <div id="wikiText">
                                    <ul>
                                        <li>${wikiData[0]}</li><br>
                                        <li>${wikiData[1]}</li><br>
                                        <li>Click <a href="${wiki[3][0]}" target="_blank">here</a> to read more.</li>
                                        <br>
                                    </ul>
                                </div>
                            </div>
                        </div>`);
                        $("#wikiCont").html(wikiDiv);
                        $("#vid-input").val("");
                        $("#loader").html("");
                    }, 1500);
                }
            });

            // Youtube AJAX section.
            var apikey = "AIzaSyCWG4gCwFSmWaI4si9ItKsSBHtA80xMnEk";
            var tubeQueryURL = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=" + searchData + "type=video&fields=etag%2Citems%2Ckind%2CnextPageToken%2CpageInfo%2CregionCode&key=" + apikey;

            // Create an AJAX call to the YouTube API.
            $.ajax({
                url: tubeQueryURL,
                method: "GET"
            }).then(function (response) {

                var item = response.items;

                var newDiv = $("<div class='vid-results'>");

                // Empty the video div 'vid-view' if it's occupied.
                $("#vid-view").empty();

                for (var i = 0; i < 10; i++) {

                    // JSON path.
                    var vidTitle = item[i].snippet.title;
                    var vidURL = item[i].id.videoId;

                    if (vidTitle.includes(searchData)) {

                        // Append embedded videos inside of a cards with template literals.
                        newDiv.append(`
                             <div class="col s6 m6">
                                 <div class="vid-color card center blue darken-4">
                                     <div class="card-content white-text">
                                         <span class="card-title">${vidTitle}</span>
                                            <div class="resp-container">
                                                <iframe class="resp-iframe" src="https://www.youtube.com/embed/${vidURL}" allow="encrypted-media; autoplay; fullscreen"></iframe>
                                            </div>
                                        </div>
                                        <div class="card-action">
                                            <button id="${vidURL}" class="btn like-btn waves-effect waves-light light-blue" type="submit" name="action"><i class="far fa-thumbs-up"></i> Like</button>
                                         <button id="${vidURL + "id"}"class="btn waves-effect waves-light red" type="submit" name="action">Likes:  0</button>
                                     </div>
                                    </div>
                                </div>`);

                        $("#vid-view").append(newDiv);

                    };
                };
            });

            // Update the "Likes" button with values from database. There is a (2) second delay.
            setTimeout(function () {

                db.ref("vids").on("value", function (snap) {

                    data = snap.val();

                    urlKeys = Object.keys(data);

                    for (var i = 0; i < urlKeys.length; i++) {
                        urlArray1.push(urlKeys[i]);
                        urlArray2.push(urlKeys[i] + "id");
                    };

                    for (var i = 0; i < urlArray1.length; i++) {

                        if (urlArray1[i] in localStorage) {

                            $('#' + urlArray1[i]).text("Liked!");
                        };
                    };

                    for (var i = 0; i < urlArray2.length; i++) {

                        dataChild = snap.child(urlArray1[i] + "/likes").val();

                        $('#' + urlArray2[i]).text("Likes: " + dataChild);
                    };
                });
            }, 2000);

            // By clicking the "Like" button, create or update a 'likes' object in Firebase per video. 
            $(document.body).on("click", ".like-btn", function (e) {
                e.preventDefault();

                var btnId = e.target.id;

                if (btnId in localStorage) {

                } else {
                    var iterateLikes = db.ref("vids/" + btnId + "/likes");

                    setTimeout(function () {
                        iterateLikes.transaction(function (likes) {
                            return likes + 1;
                        });

                        // Save btnId to localStorage, set to null.
                        localStorage.setItem(btnId, null);

                        $('#' + btnId).text("Liked!");
                    }, 500);
                };

                urlArray1 = [];
                urlArray2 = [];
            });

            // Event to download the Wiki content in a plaint text document.
            $(document).on("click", "#btn-archive", function (e) {
                e.preventDefault();
                download(wikiContent, searchData + ".txt", "text/plain");
            });
        };
    });

    // Menu button code to navigate and change theme.
    $(document).on("click", "#btn-search", function () {
        $('html,body').animate({
            scrollTop: $(".parallax-container").offset().top
        }, 1000);
    });

    $(document).on("click", "#btn-theme", function () {
        console.log($("#vid-view").html());
        $("#footer").toggleClass("blue darken-4");
        $("#toggle-image").toggleClass("toggle-image");
        $("#btn-theme").toggleClass("blue-grey lighten-3");
        $("#add-vid").toggleClass("blue accent-3");
        $("#vid-input").toggleClass("input-txt");
        $(".vid-color").toggleClass("blue darken-4");
        $(".wiki-color").toggleClass("blue darken-4");
        $("#results").toggleClass("dark-results");
    });
});