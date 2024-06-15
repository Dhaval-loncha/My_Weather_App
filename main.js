const apiKeyWeather = "f8b456cb8f2255ce2e35dd30503eed86";
const apiUrlWeather =
  "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";

const searchBox = document.querySelector("#search-input");
const searchBtn = document.querySelector("#search-img");
const mainContainer = document.getElementById("main");
const locationElement = document.getElementById("location");
const weatherIcon = document.getElementById("weather-icon");

const apiKeyPhoto = "44110303-b93a67ab5a8d375cd6e3ac17d";
const apiUrlPhoto = "https://pixabay.com/api/";

let currentPhotoIndex = 0; // Store the index of the current photo
let photos = []; // Store the photos array

async function fetchWeather(city) {
  try {
    const response = await fetch(
      apiUrlWeather + city + `&appid=${apiKeyWeather}`
    );
    const data = await response.json();
    console.log(data);
    if (!response.ok) {
      throw new Error("Failed to fetch weather");
    }
    return data;
  } catch (error) {
    console.error("Error fetching weather:", error);
  }
}

async function fetchPhoto(query) {
  try {
    const response = await fetch(
      apiUrlPhoto + `?key=${apiKeyPhoto}&q=${query}&image_type=photo`
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error("Failed to fetch photos");
    }
    return data.hits;
  } catch (error) {
    console.error("Error fetching photos:", error);
  }
}
function updateWeatherIcon(data) {
  const weatherMain = data.weather[0].main;
  if (weatherMain == "Clouds") {
    weatherIcon.src = "images/clouds.png";
  } else if (weatherMain == "Clear") {
    weatherIcon.src = "images/clear.png";
  } else if (weatherMain == "Rain") {
    weatherIcon.src = "images/rain.png";
  } else if (weatherMain == "Drizzle") {
    weatherIcon.src = "images/drizzle.png";
  } else if (weatherMain == "Mist") {
    weatherIcon.src = "images/mist.png";
  } else if (weatherMain == 'Snow') {
    weatherIcon.src = "images/snow.png";
  } else if (weatherMain == "Haze") {
    weatherIcon.src = "images/fog.png";
  } else if (weatherMain == "Smoke") {
    weatherIcon.src = "images/smoke.png";
  }
}
function displayWeather(data) {
  document.querySelector("#city").innerHTML = data.name;
  document.querySelector("#temp").innerHTML = Math.round(data.main.temp) + "°C";
  document.querySelector("#feels").innerHTML =
    "Feels like " + Math.round(data.main.feels_like) + "°C";
  document.querySelector("#humidity").innerHTML = data.main.humidity + "%";
  document.querySelector("#pressure").innerHTML = data.main.pressure + " hPa";
  document.querySelector("#wind").innerHTML =
    Math.round(data.wind.speed * 3.6) + " km/h";
  document.querySelector("#visibility").innerHTML =
    data.visibility / 1000 + " km";
  document.querySelector("#mintemp").innerHTML =
    Math.round(data.main.temp_min) + "°C";
  document.querySelector("#maxtemp").innerHTML =
    Math.round(data.main.temp_max) + "°C";

  updateWeatherIcon(data);

  const srTime = new Date(data.sys.sunrise * 1000);
  const ssTime = new Date(data.sys.sunset * 1000);

  let srHours = srTime.getHours();
  let srMinutes = srTime.getMinutes();
  const srAmpm = srHours >= 12 ? "PM" : "AM";
  srHours = srHours % 12;
  srHours = srHours ? srHours : 12; // the hour '0' should be '12'
  const srMinutesStr = srMinutes < 10 ? "0" + srMinutes : srMinutes;
  const sunriseTime = `${srHours}:${srMinutesStr} ${srAmpm}`;

  let ssHours = ssTime.getHours();
  let ssMinutes = ssTime.getMinutes();
  const ssAmpm = ssHours >= 12 ? "PM" : "AM";
  ssHours = ssHours % 12;
  ssHours = ssHours ? ssHours : 12; // the hour '0' should be '12'
  const ssMinutesStr = ssMinutes < 10 ? "0" + ssMinutes : ssMinutes;
  const sunsetTime = `${ssHours}:${ssMinutesStr} ${ssAmpm}`;

  document.querySelector("#sunrise").innerHTML = sunriseTime;
  document.querySelector("#sunset").innerHTML = sunsetTime;

  function formatCurrentDate() {
    const date = new Date();
    const options = { weekday: "long", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }
  document.querySelector("#date").innerHTML = formatCurrentDate();

  const formatCurrentTime = () => {
    const date = new Date();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesStr = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  };
  document.querySelector("#time").innerHTML = formatCurrentTime();

  // Show the main container with transition
  mainContainer.style.display = "flex";
  setTimeout(() => {
    mainContainer.classList.add("show");
  }, 10); // Small delay to ensure display change is applied
}

function displayNextPhoto() {
  if (photos.length === 0) return;
  const photo = photos[currentPhotoIndex];
  locationElement.style.setProperty(
    "--photo-url",
    `url(${photo.webformatURL})`
  );
  locationElement.classList.remove("show"); // Hide the previous image
  setTimeout(() => {
    locationElement.classList.add("show"); // Show the new image
  }, 10); // Small delay to ensure the transition works

  // Update the photo index for the next search
  currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
}

async function checkWeather(city) {
  if (!city) {
    mainContainer.style.display = "none";
    mainContainer.classList.remove("show");
    console.log("Please enter a city");
  } else {
    console.log(`City entered: ${city}`);

    try {
      const weatherData = await fetchWeather(city);
      const photoData = await fetchPhoto(city);

      if (weatherData && photoData.length > 0) {
        photos = photoData;
        displayWeather(weatherData);
        displayNextPhoto();
      } else {
        console.error("Error: No data available for the given city");
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  }
}

searchBox.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    checkWeather(searchBox.value);
    searchBox.value = "";
  }
});

searchBtn.addEventListener("click", (w) => {
  w.preventDefault();
  checkWeather(searchBox.value);
  searchBox.value = "";
});

// Initialize to hide the main container
mainContainer.style.display = "none";

// Call checkWeather without parameters to initialize
checkWeather();