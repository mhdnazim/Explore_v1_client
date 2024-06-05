'use client'
import React, { useState, useEffect } from 'react';

interface Location {
  longitude: number | null;
  latitude: number | null;
  address: string | null;
}

function MyLocation() {
  const [position, setPosition] = useState<Location>({ latitude: null, longitude: null, address: null });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // Fetch address from OpenCage Geocoding API
        const apiKey = '00af53ef37244c0d89041fd6a11a5daf'; // Replace with your OpenCage API key
        const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`);
        const data = await response.json();
        const address = data.results[0].formatted;

        setPosition({
          latitude,
          longitude,
          address
        });
      });
    } else {
      console.log("Geolocation is not available in your browser.");
    }
  }, []);

  return (
    <div>
      <h2>My Current Location</h2>
      {position.latitude && position.longitude ? (
        <p>
          Latitude: {position.latitude}, Longitude: {position.longitude}
        </p>
      ) : (
        <p>Loading...</p>
      )}
      {position.address ? (
        <p>Address: {position.address}</p>
      ) : (
        <p>Loading address...</p>
      )}
    </div>
  );
}

export default MyLocation;
