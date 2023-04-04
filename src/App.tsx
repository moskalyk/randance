import React from 'react';
import logo from './logo.svg';
import './App.css';
import useGyroscope from 'react-hook-gyroscope'

const ComponentWithGyroscope = () => {
  const [alpha, setAlpha] = React.useState(0)
  const [beta, setBeta] = React.useState(0)
  const [gamma, setGamma] = React.useState(0)

  // const gyroscope = useGyroscope()
  window.addEventListener('deviceorientation', handleOrientation);

  function handleOrientation(event: any) {
    const alpha0 = event.alpha;
    const beta0 = event.beta;
    const gamma0 = event.gamma;
    setBeta(alpha0)
    setBeta(beta0)
    setGamma(gamma0)
    // Do stuff...
  }

  return (
    <ul>
      <li className='prompt'>X: {alpha}</li>
      <li className='prompt'>Y: {beta}</li>
      <li className='prompt'>Z: {gamma}</li>
    </ul>
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
