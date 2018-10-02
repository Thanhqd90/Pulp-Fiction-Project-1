$(document).ready(function () {

    $(document.body).on("click", "#add-vid", function (event) {
        event.preventDefault();

        var wikiSearch = $("#vid-input").val().trim();
        console.log(wikiSearch);

        if (wikiSearch !== "") {

            // Wiki API call

            var wikiQueryURL = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + wikiSearch + "&limit=4&format=json";

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

            var apikey = "AIzaSyCWG4gCwFSmWaI4si9ItKsSBHtA80xMnEk";
            var keyword = $("#vid-input").val().trim();
            var tubeQueryURL = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=" + keyword + "type=video&fields=etag%2Citems%2Ckind%2CnextPageToken%2CpageInfo%2CregionCode&key=" + apikey;

            if (keyword === "") {
                return keyword;
            }

            // Create an AJAX call.
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
