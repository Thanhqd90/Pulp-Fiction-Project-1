$(document).ready(function () {

    console.log("Houston, we have code!");

    /* Initialize Thanh's Firebase API.
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
    $('.fixed-action-btn').floatingActionButton();
    $(document).ready(function () {
        $('.fixed-action-btn').floatingActionButton({
            direction: "left"
        });
    });

    // Global variables.
    var db = firebase.database();
    var data;
    var urlKeys;
    var urlArray1 = [];
    var urlArray2 = [];



    $(document.body).on("click", "#add-vid", function (e) {
        e.preventDefault();

        // scroll to search results
        $('html, body').animate({
            scrollTop: $("#results").offset().top
        }, 1000);



        // Both ajax calls can use the same input variable, 'searchData'.
        var searchData = $("#vid-input").val().trim();
        //console.log(searchData);

        var wikiContent;



        // Won't do anything if 'vid-input' is empty.
        if (searchData !== "") {

            // Wiki AJAX section.
            var wikiQueryURL = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + searchData + "&limit=4&format=json";

            $.ajax({
                url: wikiQueryURL,
                dataType: "jsonp",
                success: function (wiki) {

                    //console.log(wiki);

                    var wikiData = wiki[2];

                    // Pass content to a global variable, 'wikiContent'.
                    wikiContent = wikiData;

                    var wikiDiv = $("<div class='wikiData'>");
                    if (wikiContent.length === 0) {
                        $('#vid-input').attr('placeholder', 'No Results Found');
                        $("#vid-view").empty();
                        wikiDiv.hide();

                        setTimeout(function () {

                            $('#vid-input').attr('placeholder', 'Search Anything...');


                        }, 2000);
                    }


                    wikiDiv.append(`
                            <div class="col s12 m7">
                                <div class=" wiki-color card horizontal blue darken-4">
                                    <div id="wikiText">
                                    <ul>
                                        <li>${wikiData[0]}</li><br>
                                        <li>${wikiData[1]}</li><br>
                                        <li>Click <a href="${wiki[3][0]}" target="_blank">here</a> to read more</li><br>

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
                //console.log(response);
                //console.log(response.items);
                //console.log(item[0].snippet);
                //console.log(item[0].snippet.title);

                var newDiv = $("<div class='vid-results'>");

                //  Empty the video div ' vid-view' if it's occupied.
                $("#vid-view").empty();
                for (var i = 0; i < 5; i++) {

                    // JSON path.
                    var vidTitle = item[i].snippet.title;
                    var vidURL = item[i].id.videoId;

                    if (vidTitle.includes(searchData)) {

                    // Append embedded videos inside of a cards with template literals.
                    newDiv.append(`
                        <div class="col s12 m6">
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

                setTimeout(function () {

                    db.ref("vids").on("value", function (snap) {

                        data = snap.val();
                        //console.log(data);

                        urlKeys = Object.keys(data);
                        //console.log(urlKeys);

                        for (var i = 0; i < urlKeys.length; i++) {
                            urlArray1.push(urlKeys[i]);
                            urlArray2.push(urlKeys[i] + "id");

                        };

                        for (var i = 0; i < urlArray2.length; i++) {
                            dataChild = snap.child(urlArray1[i] + "/likes").val();
                            console.log(dataChild);
                            $('#' + urlArray2[i]).text("Likes:" + dataChild);

                        };
                    });

                });

            }, 3000);

            // By clicking the like button, create or update a 'likes' object in Firebase per videos. 
            $(document).on("click", ".like-btn", function (e) {
                e.preventDefault();

                var btnId = e.target.id;
                console.log(btnId);

                var iterateLikes = db.ref("vids/" + btnId + "/likes");

                setTimeout(function () {
                    iterateLikes.transaction(function (likes) {
                        return likes + 1;
                    });

                    $('#' + btnId).text("Liked");

                }, 1000);

                urlArray1 = [];
                urlArray2 = [];

            });

            // Event to download the Wiki content in a plaint text document.
            $(document).on("click", "#btn-archive", function (e) {
                e.preventDefault();
                download(wikiContent, searchData + ".txt", "text/plain");
            });
        }
    });

    // adding the button code to navigate and change theme

    $(document).on("click", "#btn-search", function () {
        $('html,body').animate({
            scrollTop: $(".parallax-container").offset().top
        }, 1000);
    });

    $(document).on("click", "#btn-theme", function () {
        console.log("button works");
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