async function fetchWeather() {
  const searchInput = document.getElementById("search").value.trim();
  const weatherDataSection = document.getElementById("weather-data");
  const apiKey = "6c43976a0ade5463da259e1c16ae6e00";

  // Mostrar área de resultado
  weatherDataSection.style.display = "block";

  // Validação de input
  if (searchInput === "") {
    weatherDataSection.innerHTML = `
      <div>
        <h2>Empty Input!</h2>
        <p>Please try again with a valid <u>city name</u>.</p>
      </div>
    `;
    return;
  }

  try {
    const geoResponse = await fetch(
  `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
    searchInput
  )}&limit=5&appid=${apiKey}`
);


    const geoData = await geoResponse.json();

   if (!geoResponse.ok) {
  throw new Error("Geocoding request failed");
}

if (geoData.length === 0) {
  throw new Error(`City "${searchInput}" not found`);
}


    const { lat, lon, name, country, state } = geoData[0];

    // 2️⃣ Weather - dados climáticos
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );

    const weatherData = await weatherResponse.json();

    if (!weatherResponse.ok) {
      throw new Error(weatherData.message || "Weather fetch error");
    }

    // 3️⃣ Renderização
    weatherDataSection.style.display = "flex";
    weatherDataSection.innerHTML = `
      <img 
        src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png"
        alt="${weatherData.weather[0].description}"
      />
      <div>
        <h2>${name}</h2>
        <p><strong>Temperature:</strong> ${Math.round(
          weatherData.main.temp
        )}°C</p>
        <p><strong>Description:</strong> ${
          weatherData.weather[0].description
        }</p>
      </div>
    `;

    // Limpa input
    document.getElementById("search").value = "";
  } catch (error) {
    console.error("Weather App Error:", error.message);
    weatherDataSection.innerHTML = `
      <div>
        <h2>Error</h2>
        <p>${error.message}</p>
      </div>
    `;
  }
}
