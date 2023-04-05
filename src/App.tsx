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
    if(!init){
      setInterval((path) => {
        setPath((path: any) => {
          console.log(path);
          const percentages = getPercentageTrueFalse(path.slice(-500))
          setPercentage(percentages.true)
          if(percentages.true > 50){
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
