var searchBox = $('#city-search-box')
var date = moment().format("MMM D YYYY").toUpperCase();
var searchHistoryContainer = $("#search-history");
var clearHistory = $('#searchHistoryButton');
var apiKey = "abb454b312b2fc3c31f23b45089c7b8b";
var searchHistoryArr = JSON.parse(localStorage.getItem('weather-dashboard')) || [];
var cityTitle = "";

// FUNCTION FOR ADDING SEARCH ONTO SEARCH HISTORY ARRAY
saveSearch = function (cityChosen) {

    var citySearched = {
        city: cityChosen
    }

    searchHistoryArr.push(citySearched);

    localStorage.setItem('weather-dashboard', JSON.stringify(searchHistoryArr));

    populateHistory();

}

// LON AND LAT ARE PASSED INTO OPEN WEATHER API
getWeather = function (lat, lon, city) {

    $('#city-display').text(city);

    fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=hourly,minutely&units=imperial&appid=' + apiKey)
        .then(function (response) {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        }).then(function (response) {

            populateWeatherData(response);
            currentDay();

        }).catch(function (error) {
            console.log(error);
        });

};

// GETS LON AND LAT FROM CITY CHOSEN
getLocation = function (city) {


    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey)
        .then(function (response) {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        }).then(function (response) {

            var lat = response.coord.lat;
            var lon = response.coord.lon;

            getWeather(lat, lon, city);

        }).catch(function (error) {
            console.log(error);
            modal.style.display = "block";
        });

}

// FUNCTION FOR FETCHING CURRENT DAY USING MOMENT.JS
currentDay = function () {

    $('#date').text(date);

}

// FUNCTION FOR LOADING PREVIOUS SEARCHES FROM LOCAL STORAGE
loadSearchHistory = function () {

    populateHistory();

};

// FUNCTION FOR PARSING PREVIOUS SEARCH HISTORY ONTO PAGE
populateHistory = function () {

    if (searchHistoryArr.length === 0) {

        searchHistoryContainer.html("<div>Search History...</div>")

    } else {

        searchHistoryContainer.html('');

        $.each(searchHistoryArr, function (i) {

            var citySelected = searchHistoryArr[i].city.replace(/\s+/g, '');

            var cityName = searchHistoryArr[i].city + ",";

            var cityEntry = $('<div>').addClass("city").attr("id", citySelected).text(cityName);

            searchHistoryContainer.append(cityEntry);

            var saveBtn = document.querySelector("#" + citySelected)
            saveBtn.addEventListener("click", function (event) {

                currentDay();

                getLocation(searchHistoryArr[i].city)

            })


        })

    }

}

// FUNCTION FOR PARSING API RESPONSE ONTO PAGE
populateWeatherData = function (weatherData) {

    // CURRENT WEATHER INFORMATION
    $('#icon').attr("src", "https://openweathermap.org/img/wn/" + weatherData.current.weather[0].icon + ".png");

    $('#temp').text("TEMP : " + weatherData.current.temp);
    $('#humidity').text("HUMI : " + weatherData.current.humidity);
    $('#wind').text("WIND : " + weatherData.current.wind_speed);
    $('#uv').text("UV : " + weatherData.current.uvi);


    console.log(weatherData.current.uvi);

    // UV INDEX COLOR
    if (weatherData.current.uvi >= 3 && weatherData.current.uvi <= 6) {

        $('#uv').addClass("orange");

    } else if (weatherData.current.uvi >= 6) {

        $('#uv').addClass("red");

    } else {

        $('#uv').addClass("green");

    }


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

// PRESSING ENTER FOR CITY SEARCH
$(document).on('keypress', function (e) {
    if (e.which == 13) {

        if (searchBox.val() === "") {

            modal.style.display = "block";

        } else {

            // $("#city-display").text("");

            var cityChosen = searchBox.val().toUpperCase();

            cityTitle = cityChosen;

            // $("#city-display").text(cityChosen);

            searchBox.val("");

            searchBox.attr("placeholder", "Search by city..");

            saveSearch(cityChosen);

            getLocation(cityChosen);

        }

    };


});

// EVENT LISTENER FOR CLEARING SEARCH INPUT WHEN TYPING
searchBox.on("click", function () {

    searchBox.attr("placeholder", "")

});

// EVENT LISTENER FOR CLEARING STORAGE/ARRAY/HISTORY DOM ELEMENTS
clearHistory.on("click", function () {

    searchHistoryArr = [];

    localStorage.setItem('weather-dashboard', JSON.stringify(searchHistoryArr));

    populateHistory();

});

// Get the modal
var modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

loadSearchHistory();