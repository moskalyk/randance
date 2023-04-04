import React from 'react';
import logo from './logo.svg';
import './App.css';
import useGyroscope from 'react-hook-gyroscope'

const ComponentWithGyroscope = () => {
  const gyroscope = useGyroscope()
  
  return !gyroscope.error ? (
    <ul>
      <li className='prompt'>X: {gyroscope.x}</li>
      <li className='prompt'>Y: {gyroscope.y}</li>
      <li className='prompt'>Z: {gyroscope.z}</li>
    </ul>
  ) : (
    <p className='prompt'>No gyroscope, sorry.</p>
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
