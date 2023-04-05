import React from 'react';
import './App.css';

interface DeviceOrientationEventiOS extends DeviceOrientationEvent {
  requestPermission?: () => Promise<'granted' | 'denied'>;
}

function detectGreaterAngle(x: number, y: number, z: number) {
  // Convert the x, y, and z values to radians
  const radX = Math.atan2(x, Math.sqrt(y*y + z*z));
  const radY = Math.atan2(y, Math.sqrt(x*x + z*z));
  const radZ = Math.atan2(Math.sqrt(x*x + y*y), z);
  
  // Convert the radians to degrees
  const degX = radX * (180/Math.PI);
  const degY = radY * (180/Math.PI);
  const degZ = radZ * (180/Math.PI);
  
  // Check if any of the angles are greater than 50 degrees
  if (Math.abs(degX) > 50 || Math.abs(degY) > 50 || Math.abs(degZ) > 50) {
    return true;
  } else {
    return false;
  }
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
  const [deflection, setDeflection] = React.useState(false)
  const [path, setPath] = React.useState<any>([])
  const [airdrop, setAirdrop] = React.useState(false)

  window.addEventListener('deviceorientation', handleOrientation);

  React.useEffect(() => {
    setDeflection(detectGreaterAngle(alpha, beta, gamma))
    setPath((prev: any) => [...prev, detectGreaterAngle(alpha, beta, gamma)])
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
    setInterval(() => {
      const percentages = getPercentageTrueFalse(path)
      if(percentages.true > .50){
        setAirdrop(true)
      }
    }, 20000)
  })

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
    <p>present boogy: {deflection}</p>
    <p>20s to drop: {airdrop}</p>
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
