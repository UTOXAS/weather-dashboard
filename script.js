const cityInput = document.getElementById("cityInput");
const cityList = document.getElementById("cityList");
const searchBtn = document.getElementById("searchBtn");

const backendURL = "https://weather-dashboard-umber-ten.vercel.app";
// const backendURL = "http://localhost:3000";

cityInput.addEventListener("input", async function () {
    const query = cityInput.value.trim();
    if (query.length < 2) return;

    try {
        // const response = await fetch(`http://localhost:5000/autocomplete?query=${query}`);
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
searchBtn.addEventListener("click", async function () {
    const city = cityInput.value.split(",")[0];
    if (!city) {
        alert("Please enter a city name.");
        return;
    }

    try {
        // const response = await fetch(`http://localhost:5000/weather?city=${city}`);
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