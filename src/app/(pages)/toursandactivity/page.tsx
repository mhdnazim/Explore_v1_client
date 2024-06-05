'use client'
import React, { useState } from 'react';

function GeocodeAddress() {
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });

  const getCoordinates = async (address: string) => {
    const apiKey = '00af53ef37244c0d89041fd6a11a5daf'; // Replace with your OpenCage API key
    const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}`);
    const data = await response.json();

    if (data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry;
      setCoordinates({ latitude: lat, longitude: lng });
    } else {
      console.log('No results found');
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    getCoordinates(address);
  };

  return (
    <div>
      <h2>Get Coordinates from Address</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter address"
        />
        <button type="submit">Get Coordinates</button>
      </form>
      {coordinates.latitude && coordinates.longitude ? (
        <p>
          Latitude: {coordinates.latitude}, Longitude: {coordinates.longitude}
        </p>
      ) : (
        <p>Enter an address to get coordinates</p>
      )}
    </div>
  );
}

export default GeocodeAddress;
