export default function WeatherCard({ weather }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 text-center">
      <h2 className="text-xl font-semibold text-gray-800">
        {weather.city}, {weather.country}
      </h2>
      <p className="text-2xl font-bold text-blue-600 mt-2">
        {weather.temperature}°C
      </p>
      <p className="text-sm text-gray-500 mt-1">
        Wind: {weather.windspeed} km/h
      </p>
      <p className="text-xs text-gray-400 mt-1">
        Last updated: {weather.time}
      </p>
    </div>
  );
}
