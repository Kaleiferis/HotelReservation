function initApp(data) {
    const hotelsData = data[1].entries;
    const cityBar = document.querySelector("#searchBar");
    const hotelsDataList = document.querySelector("#hotelsList");
    const form = document.querySelector("form");
    const hotelsBox = document.querySelector("#hotels");
    const price = document.querySelector("#price");
    const selectedPriceValue = document.querySelector("#selectedPrice");
    const rating = document.querySelector("#rating");
    const guestRating = document.querySelector("#guestRating");
    const hotelLocation = document.querySelector("#hotelLocation");
    const sortingList = document.querySelector("#sorting");

    const cities = [];
    const recommendations = [];
    let options = "";
    let options1 = "";
    let sortOptions = "";
    for (let i = 0; i < hotelsData.length; i++) {
        if (cities.indexOf(hotelsData[i].city) < 0) {
            cities.push(hotelsData[i].city);
            options += `<option value="${hotelsData[i].city}"></option>`;
            options1 += `<option value="${hotelsData[i].city}">${hotelsData[i].city}</option>`;
            for (let j = 0; j < hotelsData[i].filters.length; j++) {
                if (recommendations.indexOf(hotelsData[i].filters[j].name) < 0) {
                    recommendations.push(hotelsData[i].filters[j].name);
                    sortOptions += `<option value="${hotelsData[i].filters[j].name}">${hotelsData[i].filters[j].name}</option>`;
                }
            }
        }
    }
    hotelsDataList.innerHTML = options;
    hotelLocation.innerHTML = '<option value="all">All</option>' + options1;
    sortingList.innerHTML = '<option value="all">All</option>' + sortOptions;

    let filteredHotels = hotelsData;
    let selectedCity = null;
    let selectedPrice = 1500;
    let selectedRating = "";
    let selectedGuestRating = "all";
    let selectedHotelLocation = "all";
    let selectedSortBy = "all";

    function filterByCity(hotel) {
        if (selectedCity) {
            return hotel.city.toLowerCase() === selectedCity.toLowerCase();
        } else {
            return true;
        }
    }

    function filterByHotelLocation(hotel) {
        if (selectedHotelLocation != "all") {
            return hotel.city.toLowerCase() === selectedHotelLocation.toLowerCase();
        } else {
            return true;
        }
    }

    function filterBySortList(hotel) {
        if (selectedSortBy != "all") {
            return hotel.filters.map(function (names) { return names.name === selectedSortBy }
            )
        } else {
            return true;
        }
    }

    function filterByPrice(hotel) {
        return hotel.price <= selectedPrice;
    }

    function filterByRating(hotel) {
        if (selectedRating) {
            return hotel.rating == selectedRating;
        } else {
            return true;
        }
    }

    function filterByGuestRating(hotel) {
        if (selectedGuestRating != "all") {
            return hotel.ratings.text == selectedGuestRating;
        } else {
            return true;
        }
    }

    function filterHotels() {

        filteredHotels = hotelsData.filter(function (hotel) {
            return (
                filterByCity(hotel) &&
                filterByPrice(hotel) &&
                filterByRating(hotel) &&
                filterByGuestRating(hotel) &&
                filterByHotelLocation(hotel) &&
                filterBySortList(hotel)
            );
        });
        showHotels();
    }

    function handleSubmit(event) {
        event.preventDefault();
        selectedCity = cityBar.value;
        filterHotels();
    }

    function handlePriceInput(event) {
        selectedPriceValue.innerHTML = price.value + " &euro;";
    }

    function handlePriceChange(event) {
        selectedPrice = parseInt(price.value);
        filterHotels();
    }

    function handleRating(event) {
        selectedRating = parseInt(rating.value);
        filterHotels();
    }

    function handleGuestRating(event) {
        selectedGuestRating = guestRating.value;
        filterHotels();
    }

    function handleCity() {
        selectedHotelLocation = hotelLocation.value;
        filterHotels();
    }

    function handleSorting() {
        selectedSortBy = sortingList.value;
        filterHotels();
    }

    function showHotels() {
        hotelsBox.innerHTML = "";
        let hotelsOutput = "";
        filteredHotels.map(function (hotel) {
            hotelsOutput += `
            <div class="container">
             <div class="hotel">
              <div class="row">
                <div class=" col-lg-4 col-md-6 col-sm-4 col-xs-4" >
                    <img src="${hotel.thumbnail}" width="250" height="250">             
                </div> 
                <div class="col-lg-4 col-md-6 col-xs-4 ">
                  <h3><i>${hotel.hotelName}</i></h3>
                  <p id="stars" >Rating: ${hotel.rating}  <span class="fa fa-star checked"></span> <span style="padding-left: 20px;">Hotel</span></p>
                  <p>${hotel.city}</p>
                  <p><span class="badge badge-success badge-pill">${hotel.ratings.no}</span> ${hotel.ratings.text}</p>
                  <p class="price" ><b> ${hotel.price} &euro;</b></p>
                </div>
                <div class="col-lg-4 col-md-2 col-sm-4 col-xs-4 ">
                 <iframe src=${hotel.mapurl} width="250" height="200" frameborder="0" style="border:0; padding-top: 25px" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>
               </div>
              </div> 
             </div>
            </div>
          `;
        });
        hotelsBox.innerHTML = hotelsOutput;
    }

    showHotels();

    form.addEventListener("submit", handleSubmit);
    price.addEventListener("input", handlePriceInput);
    price.addEventListener("change", handlePriceChange);
    rating.addEventListener("change", handleRating);
    guestRating.addEventListener("change", handleGuestRating);
    hotelLocation.addEventListener("change", handleCity);
    sortingList.addEventListener("change", handleSorting);
}

fetch("data.json")
    .then(function (response) {
        return response.json();
    })
    .then(initApp)
    .catch(function (error) {
        console.log("Error:", error.message);
    });
