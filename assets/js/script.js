var searchBox = $('#city-search-box')
var date = moment().format("MMM D YYYY").toUpperCase();
var searchHistoryContainer = $("#history-container");
var searchHistoryArr = [];

currentDay = function () {

    $('#date').text(date);

}

loadSearchHistory = function () {

};

populateHistory = function () {

    searchHistoryContainer.html('');

    $.each(searchHistoryArr, function (i) {

        console.log(searchHistoryArr[i]);

        var cityName = searchHistoryArr[i].city + ",";

        var cityEntry = $('<div>').addClass("city").text(cityName);

        searchHistoryContainer.append(cityEntry);

    })

}

saveSearch = function (cityChosen) {

    var citySearched = {
        city: cityChosen
    }

    searchHistoryArr.push(citySearched);

    localStorage.setItem('weather-dashboard', JSON.stringify(searchHistoryArr));

    console.log(searchHistoryArr);

    populateHistory();


}

// PRESSING ENTER FOR CITY SEARCH
$(document).on('keypress', function (e) {
    if (e.which == 13) {

        if (searchBox.val() === "") {

            alert("type proper city!");

        } else {

            $("#city-display").text("");

            var cityChosen = searchBox.val().toUpperCase();

            $("#city-display").text(cityChosen);

            searchBox.val("");

            searchBox.attr("placeholder", "Search by city..");

            currentDay();

            saveSearch(cityChosen);

        }



    };

});

searchBox.on("click", function () {

    searchBox.attr("placeholder", "")

});
