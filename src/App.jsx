import { useState } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";

export default function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch weather for a city
  const fetchWeather = async (city) => {
    if (!city) return;
    try {
      setLoading(true);
      setError("");
      setWeather(null);

      // Geocoding API: city -> lat/lon
      const geoResp = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          city
        )}&count=1`
      );
      if (!geoResp.ok) throw new Error("Geocoding API error");
      const geo = await geoResp.json();

      if (!geo.results || geo.results.length === 0) {
        setError("City not found. Try another.");
        return;
      }

      const { latitude, longitude, name, country } = geo.results[0];

      // Weather API: get current weather
      const weatherResp = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      if (!weatherResp.ok) throw new Error("Weather API error");
      const data = await weatherResp.json();

      if (!data.current_weather) {
        setError("Weather data not available.");
        return;
      }

      setWeather({
        city: name,
        country,
        temperature: data.current_weather.temperature,
        windspeed: data.current_weather.windspeed,
        weathercode: data.current_weather.weathercode,
        time: data.current_weather.time,
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "Unexpected error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gradient-to-b from-sky-200 to-sky-500 p-6">
      <div className="w-full max-w-md">
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white">🌤️ Weather Now</h1>
          <p className="text-sm text-white/90 mt-1">
            Quick current weather by city
          </p>
        </header>

        <SearchBar onSearch={fetchWeather} />

        <div className="mt-4">
          {loading && (
            <div className="text-center text-white">Loading weather…</div>
          )}
          {error && (
            <div className="text-center text-red-700 bg-red-100 p-2 rounded-md">
              {error}
            </div>
          )}
          {weather && <WeatherCard weather={weather} />}
        </div>

        <footer className="mt-6 text-center text-xs text-white/80">
          Data from Open-Meteo (no API key required)
        </footer>
      </div>
    </div>
  );
}
