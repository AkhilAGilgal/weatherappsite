
const API_KEY = "https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}"; // Replace with your actual API key
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";


const locationInput = document.getElementById("locationInput");
const searchBtn = document.getElementById("searchBtn");
const toggleUnitsBtn = document.getElementById("toggleUnits");
const weatherInfo = document.getElementById("weatherInfo");


let currentUnits = "metric"; // Default to Celsius


async function fetchWeather(city, units = "metric") {
  try {
    const response = await fetch(
      `${BASE_URL}?q=${city}&units=${units}&appid=${API_KEY}`
    );
    if (!response.ok) throw new Error("City not found");
    return await response.json();
  } catch (error) {
    console.error("Error fetching weather:", error);
    return null;
  }
}


function displayWeather(data, units) {
  if (!data) {
    weatherInfo.innerHTML = "<p>Weather data not available. Please try another city.</p>";
    return;
  }

  const tempUnit = units === "metric" ? "°C" : "°F";
  const windUnit = units === "metric" ? "m/s" : "mph";

  weatherInfo.innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <div class="weather-main">
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}">
      <p class="temperature">${Math.round(data.main.temp)}${tempUnit}</p>
    </div>
    <p class="description">${data.weather[0].description}</p>
    <div class="details">
      <p>Humidity: ${data.main.humidity}%</p>
      <p>Wind: ${data.wind.speed} ${windUnit}</p>
      <p>Feels like: ${Math.round(data.main.feels_like)}${tempUnit}</p>
    </div>
  `;
}


function savePreferences(city, units) {
  localStorage.setItem("weatherPrefs", JSON.stringify({ city, units }));
}

function loadPreferences() {
  const prefs = localStorage.getItem("weatherPrefs");
  return prefs ? JSON.parse(prefs) : { city: "London", units: "metric" };
}

async function initApp() {
  const { city, units } = loadPreferences();
  currentUnits = units;
  locationInput.value = city;
  const weatherData = await fetchWeather(city, units);
  displayWeather(weatherData, units);
}

searchBtn.addEventListener("click", async () => {
  const city = locationInput.value.trim();
  if (!city) return;
  const weatherData = await fetchWeather(city, currentUnits);
  if (weatherData) {
    displayWeather(weatherData, currentUnits);
    savePreferences(city, currentUnits);
  }
});

toggleUnitsBtn.addEventListener("click", async () => {
  currentUnits = currentUnits === "metric" ? "imperial" : "metric";
  const city = locationInput.value.trim() || JSON.parse(localStorage.getItem("weatherPrefs")).city;
  const weatherData = await fetchWeather(city, currentUnits);
  displayWeather(weatherData, currentUnits);
  savePreferences(city, currentUnits);
});


document.addEventListener("DOMContentLoaded", initApp);
