import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { faCloudSun, faCloud, faCloudSunRain, faMoon, faAdjust } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [err, setErr] = useState(null);
  const [weather, setWeather] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const API_KEY = '66f50412cad1f7e200d0302028371181';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        setWeather(response.data);
        setErr(null);
      } catch (err) {
        setErr(err);
      }
    };

    if (city) {
      fetchData();
    }
  }, [city]);

  const isDayTime = () => {
    if (!weather || !weather.sys || !weather.sys.sunrise || !weather.sys.sunset) {
      return false;
    }
    const now = Date.now() / 1000; // Convert milliseconds to seconds
    return now > weather.sys.sunrise && now < weather.sys.sunset;
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    // Automatically set dark mode based on day/night
    if (weather) {
      setIsDarkMode(!isDayTime());
    }
  }, [weather]);

  return (
    <div className={`App ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <button onClick={toggleDarkMode} className="toggle-button">
        <FontAwesomeIcon icon={faAdjust} className="toggle-icon" />
      </button>
      <h1>Weather App</h1>
      <input type='text' placeholder='Enter City Name' value={city} onChange={(e) => setCity(e.target.value)} />
      {weather ? (
        <>
          <h2>Current Weather in {weather.name}</h2>
          <div className="weather-details">
            <p>Temperature: {weather.main.temp}°C</p>
            <p>Description: {weather.weather[0].description}</p>
          </div>
          <div className="weather-icon">
            {isDayTime() ? (
              <>
                {weather.weather[0].main === 'Clear' ? (
                  <FontAwesomeIcon icon={faCloudSun} size="2x" /> // Sunny
                ) : weather.weather[0].main === 'Clouds' && weather.clouds.all < 50 ? (
                  <FontAwesomeIcon icon={faCloudSun} size="2x" /> // Scattered clouds
                ) : weather.weather[0].main === 'Clouds' ? (
                  <FontAwesomeIcon icon={faCloud} size="2x" /> // Cloudy
                ) : weather.weather[0].main === 'Rain' || weather.weather[0].main === 'Drizzle' ? (
                  <FontAwesomeIcon icon={faCloudSunRain} size="2x" /> // Rain or drizzle
                ) : (
                  <FontAwesomeIcon icon={faAdjust} size="2x" /> // Default icon or adjust as needed
                )}
              </>
            ) : (
              <>
                {weather.weather[0].main === 'Clear' ? (
                  <FontAwesomeIcon icon={faMoon} size="2x" /> // Clear night
                ) : weather.weather[0].main === 'Clouds' ? (
                  <FontAwesomeIcon icon={faCloud} size="2x" /> // Cloudy night
                ) : (
                  <FontAwesomeIcon icon={faAdjust} size="2x" /> // Default icon or adjust as needed
                )}
              </>
            )}
          </div>
        </>
      ) : err ? (
        <p>Error fetching current weather: {err.message}</p>
      ) : (<p>Enter city name</p>)}
    </div>
  );
}

export default App;
