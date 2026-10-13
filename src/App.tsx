import { useState } from "react";
import "./index.css";

type Position = {
  lat: number;
  lng: number;
};

function useGeolocation() {
  const [isLoading, setIsLoading] = useState(false);

  const [position, setPosition] = useState<Position | null>(null);

  const [error, setError] = useState<string | null>(null);

  function getPosition() {
    setError(null);

    if (!navigator.geolocation) {
      setError("Your browser does not support geolocation");
      return;
    }

    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });

        setIsLoading(false);
      },
      (err) => {
        setError(err.message);
        setIsLoading(false);
      },
    );
  }

  return { isLoading, position, error, getPosition };
}

export default function App() {
  const { isLoading, position, error, getPosition } = useGeolocation();

  const [countClicks, setCountClicks] = useState(0);

  function handleClick() {
    setCountClicks((count) => count + 1);
    getPosition();
  }

  return (
    <main className="app">
      <div className="app-icon">📍</div>

      <h1>Find My Location</h1>

      <p className="description">
        Discover your current location with one click. Allow your browser to
        access your location to continue.
      </p>

      <button onClick={handleClick} disabled={isLoading}>
        {isLoading ? "Getting location..." : "Get my position"}
      </button>

      {isLoading && <p className="loading">Loading your position...</p>}

      {error && <p className="error">{error}</p>}

      {!isLoading && !error && position && (
        <div className="position">
          <p className="position-title">Your GPS position</p>

          <a
            target="_blank"
            rel="noreferrer"
            href={`https://www.openstreetmap.org/#map=16/${position.lat}/${position.lng}`}
          >
            {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
          </a>
        </div>
      )}

      <p className="clicks">
        You requested position <span>{countClicks}</span> times
      </p>
    </main>
  );
}
