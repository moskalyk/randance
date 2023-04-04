import React from 'react';
import logo from './logo.svg';
import './App.css';
import useGyroscope from 'react-hook-gyroscope'

const ComponentWithGyroscope = () => {
  const gyroscope = useGyroscope()

  return !gyroscope.error ? (
    <ul>
      <li>X: {gyroscope.x}</li>
      <li>Y: {gyroscope.y}</li>
      <li>Z: {gyroscope.z}</li>
    </ul>
  ) : (
    <p>No gyroscope, sorry.</p>
  )
}

function App() {
  return (
    <div className="App">
     <ComponentWithGyroscope/>
    </div>
  );
}

export default App;
