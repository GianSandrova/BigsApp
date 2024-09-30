'use client'
import React, { useState, useEffect } from 'react';

function GeolocationComponent() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation tidak didukung oleh browser Anda');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        setError(`Error: ${error.message}`);
      }
    );
  }, []);

  return (
    <div>
      {location ? (
        <p>
          Latitude: {location.latitude}, Longitude: {location.longitude}
        </p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <p>Memuat lokasi...</p>
      )}
    </div>
  );
}

export default GeolocationComponent;