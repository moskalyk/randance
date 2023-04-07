import React from 'react';
import { MapContainer, TileLayer, Circle } from 'react-leaflet';

function Map() {
  const center = [51.505, -0.09]; // Lat and Lng coordinates
  const radius = 1000; // Radius in meters

  return (
    <MapContainer center={[45.4, -75.7]} style={{ height: '100vh' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Circle center={center}/>
    </MapContainer>
  );
}

export default Map;