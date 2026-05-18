// controllers/weather.controller.js
const axios = require("axios");

exports.getWeather = async (req, res) => {
  try {
    const { city, lat, lon } = req.query;

    let url;
    if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;
    } else {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;
    }

    const response = await axios.get(url);

    const weatherData = {
      temperature: response.data.main.temp,
      feelsLike: response.data.main.feels_like,
      humidity: response.data.main.humidity,
      condition: response.data.weather[0].main,
      description: response.data.weather[0].description,
      windSpeed: response.data.wind.speed,
      icon: response.data.weather[0].icon,
      city: response.data.name,
      country: response.data.sys.country,
    };

    res.json(weatherData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching weather", error: error.message });
  }
};

exports.getForecast = async (req, res) => {
  try {
    const { city } = req.query;
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;

    const response = await axios.get(url);

    const forecast = response.data.list.slice(0, 8).map((item) => ({
      date: item.dt_txt,
      temperature: item.main.temp,
      condition: item.weather[0].main,
      description: item.weather[0].description,
      humidity: item.main.humidity,
    }));

    res.json(forecast);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching forecast", error: error.message });
  }
};
