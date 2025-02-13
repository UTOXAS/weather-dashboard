const cityInput = document.getElementById("cityInput");
const cityList = document.getElementById("cityList");
const searchBtn = document.getElementById("searchBtn");

const backendURL = window.location.hostname === "localhost"
? "http://localhost:5000"
: "https://weather-dashboard-umber-ten.vercel.app";


cityInput.addEventListener("input", async function () {
    if (checkIfCityinList()) {
        cityList.innerHTML = "";
        searchBtn.click();
        return;
    }

    const query = cityInput.value.trim();
    if (query.length < 2) {
        cityList.innerHTML = "";
        return;
    }

    try {
        const response = await fetch(`${backendURL}/autocomplete?query=${query}`);
        const data = await response.json();

        cityList.innerHTML = "";
        data.forEach(city => {
            const option = document.createElement("option");
            option.value = `${city.name}, ${city.country}`;
            cityList.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching city suggestions", error);
    }
});


cityInput.addEventListener("input", function() {
    if (checkIfCityinList()) {
        cityList.innerHTML = "";
        searchBtn.click();
    }
    
});

function checkIfCityinList() {
    const selectedCity = cityInput.value.trim();
    const options = [...cityList.options].map(option => option.value);

    if (options.includes(selectedCity)) {
        return true;
    }

    return false;
}



cityInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        cityInput.innerHTML = "";
        searchBtn.click();
    }
});


searchBtn.addEventListener("click", async function () {
    const city = cityInput.value.split(",")[0];
    if (!city) {
        alert("Please enter a city name.");
        return;
    }

    try {
        const response = await fetch(`${backendURL}/weather?city=${city}`);
        const data = await response.json();

        if (data.error) {
            document.getElementById("weatherResult").innerHTML = `<p class="text-danger">${data.error}</p>`;
            return;
        }

        document.getElementById("weatherResult").innerHTML = `
            <h2>${data.city}, ${data.country}</h2>
            <h3>${data.temperature}°C</h3>
            <p>Wind Speed: ${data.windspeed} m/s</p>
        `;
    } catch (error) {
        document.getElementById("weatherResult").innerHTML = `<p class="text-danger">Error fetching data</p>`;
    }
});

