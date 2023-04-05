import React from 'react';
import './App.css';

interface DeviceOrientationEventiOS extends DeviceOrientationEvent {
  requestPermission?: () => Promise<'granted' | 'denied'>;
}

function checkGyroscopeReadings(readings: any, timeframe: number) {
  const movementThreshold = 45; // adjust this as needed
  let movementCount = 0;
  
  // loop through the readings and check for movement
  for (let i = 0; i < readings.length; i++) {
    const reading = readings[i];
    if (Math.abs(reading.x) > movementThreshold || 
        Math.abs(reading.y) > movementThreshold || 
        Math.abs(reading.z) > movementThreshold) {
      movementCount++;
    }
  }
  
  // calculate the movement rate and check if it exceeds the threshold
  const movementRate = movementCount / readings.length;
  const timeframeInSeconds = timeframe / 1000; // convert to seconds
  const movementPerSecond = movementRate / timeframeInSeconds;
  return movementPerSecond > 0.4; // adjust this as needed
}

function getPercentageTrueFalse(arr: any) {
  const countTrue = arr.reduce((acc: any, val: any) => val ? acc + 1 : acc, 0);
  const countFalse = arr.length - countTrue;
  const percentageTrue = (countTrue / arr.length) * 100;
  const percentageFalse = (countFalse / arr.length) * 100;
  return { true: percentageTrue, false: percentageFalse };
}

const ComponentWithGyroscope = () => {
  const [alpha, setAlpha] = React.useState(1)
  const [beta, setBeta] = React.useState(1)
  const [gamma, setGamma] = React.useState(1)
  const [init, setInit] = React.useState(false)
  const [deflection, setDeflection] = React.useState(false)
  const [path, setPath] = React.useState<any>([])
  const [airdrop, setAirdrop] = React.useState(false)
  const [percentage, setPercentage] = React.useState(0)
  window.addEventListener('deviceorientation', handleOrientation);

  React.useEffect(() => {
    // setDeflection(checkGyroscopeReadings(path, 5000))
    setPath((prev: any) => [...prev, {x: alpha, y: beta, z: gamma}])
  }, [alpha, beta, gamma])

  function handleOrientation(event: any) {
    const alpha0 = event.alpha;
    const beta0 = event.beta;
    const gamma0 = event.gamma;
    setAlpha(alpha0)
    setBeta(beta0)
    setGamma(gamma0)
    // Do stuff...
  }

  React.useEffect(() => {
    if(!init){
      setInterval((path) => {
        setPath((path: any) => {
          console.log(path);
          const check = checkGyroscopeReadings(path, 5000)
          if(check){
            setAirdrop(true)
          }
          return path.slice(-500)
        });

      }, 5000, path)
      setInit(true)
    }

    // for testing
    // setInterval(()=> {
    //   setAlpha(alpha* (1+Math.random()))
    //   setBeta(beta* (1+Math.random()))
    //   setGamma(gamma * (1+Math.random()))
    // },300)
  }, [path, airdrop])

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
    <p>present boogy: {deflection.toString()}</p>
    <p>20s to drop: {airdrop.toString()}</p>
    <p>percentage: {percentage}</p>
    <p>{path.slice(path.length - 10).toString()}</p>
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
