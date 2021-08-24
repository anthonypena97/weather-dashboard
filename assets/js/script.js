var searchBox = $('#city-search-box')
var date = moment().format("MMM D YYYY").toUpperCase();
var searchHistoryContainer = $("#history-container");
var searchHistoryArr = [];
var apiKey = "abb454b312b2fc3c31f23b45089c7b8b";

getWeather = function (city) {

    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey)
        .then(response => {
            response.json();

            // if bad response
            if (response.status === 404) {
                alert("city not found!");
            }
        }
        )
        .then(data => console.log(data))


}

currentDay = function () {

    $('#date').text(date);

}

loadSearchHistory = function () {

};

populateHistory = function () {

    searchHistoryContainer.html('');

    $.each(searchHistoryArr, function (i) {

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

            getWeather(cityChosen);

        }



    };

});

searchBox.on("click", function () {

    searchBox.attr("placeholder", "")

});