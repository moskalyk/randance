import React from 'react';
import './App.css';

interface DeviceOrientationEventiOS extends DeviceOrientationEvent {
  requestPermission?: () => Promise<'granted' | 'denied'>;
}

const TIME = 5000

function checkGyroscopeReadings(readings: any, timeframe: number) {
  const movementThreshold = 0.08; // adjust this as needed
  let movementCount = 0;
  let prevReading = null;
  
  // loop through the readings and check for movement
  for (let i = 0; i < readings.length; i++) {
    const reading = readings[i];
    if (prevReading !== null) {
      const relativeChangeX = Math.abs((reading.x - prevReading.x) / prevReading.x);
      const relativeChangeY = Math.abs((reading.y - prevReading.y) / prevReading.y);
      const relativeChangeZ = Math.abs((reading.z - prevReading.z) / prevReading.z);
      if (relativeChangeX > movementThreshold || 
          relativeChangeY > movementThreshold || 
          relativeChangeZ > movementThreshold) {
        movementCount++;
      }
    }
    prevReading = reading;
  }
  
  // calculate the movement rate and check if it exceeds the threshold
  const movementRate = movementCount / (readings.length - 1);
  const timeframeInSeconds = timeframe / 1000; // convert to seconds
  const movementPerSecond = movementRate / timeframeInSeconds;
  return movementPerSecond > 0.08; // adjust this as needed
}

function getPercentageTrueFalse(arr: any) {
  const countTrue = arr.reduce((acc: any, val: any) => val ? acc + 1 : acc, 0);
  const countFalse = arr.length - countTrue;
  const percentageTrue = (countTrue / arr.length) * 100;
  const percentageFalse = (countFalse / arr.length) * 100;
  return { true: percentageTrue, false: percentageFalse };
}

const ComponentWithGyroscope = () => {
  const [alpha, setAlpha] = React.useState(0)
  const [beta, setBeta] = React.useState(0)
  const [gamma, setGamma] = React.useState(0)
  const [init, setInit] = React.useState(false)
  const [path, setPath] = React.useState<any>([])
  const [airdrop, setAirdrop] = React.useState(false)

  window.addEventListener('deviceorientation', handleOrientation);

  React.useEffect(() => {
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
          const check = checkGyroscopeReadings(path, TIME)
          if(check){
            setAirdrop(true)
            document.body.style.backgroundColor = 'cyan'
          }else {
            setAirdrop(false)
            document.body.style.backgroundColor = 'white'
          }
          return path.slice(-500)
        });

      }, TIME, path)
      setInit(true)
    }
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

  React.useEffect(() => {
    navigator.geolocation.getCurrentPosition(function(position) {
      // console.log("Latitude is :", position.coords.latitude);
      // console.log("Longitude is :", position.coords.longitude);

      alert(`lat: ${position.coords.latitude}, lng: ${position.coords.longitude}`)
    });
  }, [airdrop])

  return (
    <>
    <button onClick={click}>approve</button>
    <ul>
      <li className='prompt'>X: {alpha}</li>
      <li className='prompt'>Y: {beta}</li>
      <li className='prompt'>Z: {gamma}</li>
    </ul>
    <p>20s to drop: {airdrop.toString()}</p>
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
