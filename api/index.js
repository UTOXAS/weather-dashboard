const express = require('express');
const cors = require('cors');
const axios = require('axios');
// const path = require('path');


const app = express();

// app.use(express.static(path.join(__dirname, '../public')));


const allowedOrigins = ["https://utoxas.github.io"];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("CORS not allowed"));
        }
    },
    credentials: true
}));

app.use(express.json());


app.get('/weather', async (req, res) => {
    res.setHeader("Access-Control.Allow-Origin", "*");
    try {
        const { city } = req.query;
        if (!city) return res.status(400).json({ error: 'City is required '});

        const geoResponse = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);
        const geoData = geoResponse.data;

        if (!geoData.results || geoData.results.length === 0) {
            return res.status(404).json({ error: 'City not found '});
        }

        const { latitude, longitude } = geoData.results[0];
        const weatherResponse = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
        const weatherData = weatherResponse.data;

        res.json({
            city: geoData.results[0].name,
            country: geoData.results[0].country,
            temperature: weatherData.current_weather.temperature,
            windspeed: weatherData.current_weather.windspeed,
            weathercode: weatherData.current_weather.weathercode
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching weather data' });
    }
});

app.get('/autocomplete', async (req, res) => {
    res.setHeader("Access-Control.Allow-Origin", "*");
    try {
        const { query } = req.query;
        if (!query) return res.status(400).json({ error: 'Query is required' });

        const geoResponse = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${query}`);
        const geoData = geoResponse.data;

        if (!geoData.results || geoData.results.length === 0) {
            return res.json([]);
        }

        const suggesions = geoData.results.map(city => ({
            name: city.name,
            country: city.country
        }));

        res.json(suggesions);
    } catch (error) {
        res.status(500).json( { error: 'Error fetching city suggestions' });
    }
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "production") {
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
