import React from 'react';
import logo from './logo.svg';
import './App.css';

interface DeviceOrientationEventiOS extends DeviceOrientationEvent {
  requestPermission?: () => Promise<'granted' | 'denied'>;
}

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

  function click() {
    console.log(DeviceMotionEvent)

    const requestPermission = (DeviceOrientationEvent as unknown as DeviceOrientationEventiOS).requestPermission;

    if (typeof requestPermission  === 'function') {
      // Handle iOS 13+ devices.
      requestPermission()
        .then((state: any) => {
          if (state === 'granted') {
            window.addEventListener('devicemotion', handleOrientation);
          } else {
            console.error('Request to access the orientation was rejected');
          }
        })
        .catch(console.error);
    } else {
      // Handle regular non iOS 13+ devices.
      window.addEventListener('devicemotion', handleOrientation);
    }
  }

  return (
    <>
    <button onClick={click}>approve</button>
    <ul>
      <li className='prompt'>X: {alpha}</li>
      <li className='prompt'>Y: {beta}</li>
      <li className='prompt'>Z: {gamma}</li>
    </ul>
    </>
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
