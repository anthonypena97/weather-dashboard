var searchBox = $('#city-search-box')
var date = moment().format("MMM D YYYY").toUpperCase();
var searchHistoryContainer = $("#history-container");
var searchHistoryArr = [];
var apiKey = "abb454b312b2fc3c31f23b45089c7b8b";

getWeather = function (lat, lon) {

    fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=hourly,minutely&units=imperial&appid=' + apiKey)
        .then(function (response) {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        }).then(function (response) {
            console.log(response);

            populateWeatherData(response);


        }).catch(function (error) {
            console.log(error);
        });

};

getLocation = function (city) {

    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey)
        .then(function (response) {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        }).then(function (response) {
            console.log(response);

            var lat = response.coord.lat;
            var lon = response.coord.lon;

            getWeather(lat, lon);

        }).catch(function (error) {
            console.log(error);
            alert('City not found!');
        });

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

populateWeatherData = function (weatherData) {

    console.log(weatherData);

    // CURRENT WEATHER INFORMATION
    $('#icon').attr("src", "https://openweathermap.org/img/wn/" + weatherData.current.weather[0].icon + ".png");

    $('#temp').text("TEMP : " + weatherData.current.temp);
    $('#humidity').text("HUMI : " + weatherData.current.humidity);
    $('#wind').text("WIND : " + weatherData.current.wind_gust);
    $('#uv').text("UV : " + weatherData.current.uvi);


    var forecastContainer = $("#forecastContainer");

    // clears out previous elements
    forecastContainer.html("");


    // FORECAST
    for (i = 0; i < 5; i++) {

        var d = i + 1;
        var day = moment().add(d, "days").format("MMM D YYYY").toUpperCase();

        var forecastCard = $("<div>").addClass("forecast col")

        var forecastDate = $("<div>").addClass("row").text(day)
        forecastCard.append(forecastDate);

        var forecastIcon = $("<img>").addClass("row small-icon").attr("src", "https://openweathermap.org/img/wn/" + weatherData.daily[i].weather[0].icon + ".png")

        forecastCard.append(forecastIcon);

        var forecastTemp = $("<div>").addClass("row").text("TEMP : " + weatherData.daily[i].temp.max)
        forecastCard.append(forecastTemp);

        var forecastWind = $("<div>").addClass("row").text("WIND : " + weatherData.daily[i].wind_gust)
        forecastCard.append(forecastWind);

        var forecastHumi = $("<div>").addClass("row").text("HUMI : " + weatherData.daily[i].humidity)
        forecastCard.append(forecastHumi);

        forecastContainer.append(forecastCard)

    };



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

            getLocation(cityChosen);

        }

    };


});

searchBox.on("click", function () {

    searchBox.attr("placeholder", "")

});