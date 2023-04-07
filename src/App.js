import React, {useState} from 'react';
import './App.css';
import { sequence } from '0xsequence'
import randance_login from './randance_login.png'
import { Map, Marker, GeoJson, ZoomControl, GeoJsonFeature} from "pigeon-maps"
import { stamenToner } from 'pigeon-maps/providers'

const TIME = 5000

function checkGyroscopeReadings(readings, timeframe) {
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

function getPercentageTrueFalse(arr) {
  const countTrue = arr.reduce((acc, val) => val ? acc + 1 : acc, 0);
  const countFalse = arr.length - countTrue;
  const percentageTrue = (countTrue / arr.length) * 100;
  const percentageFalse = (countFalse / arr.length) * 100;
  return { true: percentageTrue, false: percentageFalse };
}

const ComponentWithGyroscope = (props) => {
  const [init, setInit] = React.useState(false)
  const [path, setPath] = React.useState([])
  const [airdrop, setAirdrop] = React.useState(false)

  React.useEffect(() => {
    setPath((prev) => [...prev, {x: props.alpha, y: props.beta, z: props.gamma}])
  }, [props.alpha, props.beta, props.gamma])

  React.useEffect(() => {
    if(!init){
      setInterval((path) => {
        setPath((path) => {
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

  return (
    <>
    <ul>
      <span className='prompt'>X: {props.alpha}</span>
      <span className='prompt'>Y: {props.beta}</span>
      <span className='prompt'>Z: {props.gamma}</span>
    </ul>
    <p>{TIME/1000}s to drop: {airdrop.toString()}</p>
    </>
  )
}

export function MyMap() {

  const [center, setCenter] = useState(null)
  const [hue1, setHue1] = useState(50)
  const [hue2, setHue2] = useState(100)
  const color1 = `hsl(${hue1 % 360}deg 39% 70%)`
  const color2 = `hsl(${hue2 % 360}deg 39% 70%)`

  const successCallback = (position) => {
    console.log(position);
    console.log(position)
    setCenter([position.coords.latitude, position.coords.longitude])
  };
  
  const errorCallback = (error) => {
    console.log(error);
  };
  
  let geolocationID;
  
  if ("geolocation" in navigator) {
    // Access the API
    geolocationID = navigator.geolocation.watchPosition(
      successCallback,
      errorCallback
    );
  } else {
    // Use a third-party geolocation service
    console.log("Browser does not support the Geolocation API");
  }
  

  React.useEffect(() => {
    navigator.geolocation.getCurrentPosition(function(position) {
      setCenter([position.coords.latitude, position.coords.longitude])
    }, function() {
      console.log('error')
    }, {timeout:10000});
  }, [])

  return (
      <> {center ? (
        <>
        <Map provider={stamenToner} height={300} defaultCenter={center} defaultZoom={15}>
        <Marker 
          width={50}
          anchor={getRandomSpot(center[0], center[1])} 
          color={color2} 
          onClick={() => setHue2(hue2 + 20)} 
        />
        <Marker 
          width={50}
          anchor={center} 
          color={color1} 
          onClick={() => setHue1(hue1 + 20)} 
        ></Marker>
        <ZoomControl/>
      </Map>
      </>
      ) : null }</>
  )
}

function getRandomSpot(latitude, longitude) {
  const radiusInMeters = 1000 * Math.random(); // 1km radius
  const radiusInDegrees = radiusInMeters / 111300; // Convert meters to degrees

  const u = Math.random();
  const v = Math.random();

  const w = radiusInDegrees * Math.sqrt(u);
  const t = 2 * Math.PI * v;

  const x = w * Math.cos(t);
  const y = w * Math.sin(t);

  const newX = x / Math.cos(latitude);

  const newLatitude = latitude + y;
  const newLongitude = longitude + newX;

  return [newLatitude, newLongitude];
}

function Login(props) {

  window.addEventListener('deviceorientation', handleOrientation);

  function handleOrientation(event) {
    const alpha0 = event.alpha;
    const beta0 = event.beta;
    const gamma0 = event.gamma;
    props.setAlpha(alpha0)
    props.setBeta(beta0)
    props.setGamma(gamma0)
  }

  const click = () => {
    console.log(DeviceMotionEvent)

    const requestPermission = (DeviceOrientationEvent).requestPermission;

    if (typeof requestPermission  === 'function') {
      // Handle iOS 13+ devices.
      requestPermission()
        .then((state) => {
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

  const login = async () => {

    const wallet = sequence.getWallet()

    const connectDetails = await wallet.connect({
      app: 'randance',
      authorize: true,
      settings: {
        theme: "light",
        // bannerUrl: "https://yoursite.com/banner-image.png",  // 3:1 aspect ratio, 1200x400 works best
      }
    })
    console.log(connectDetails)
    localStorage.setItem('proof', connectDetails.proof.proofString)
    click()
  }
  return (
    <img onClick={login} className="login" src={randance_login} />
  )
}

function App() {

  const [alpha, setAlpha] = React.useState(0)
  const [beta, setBeta] = React.useState(0)
  const [gamma, setGamma] = React.useState(0)

  sequence.initWallet('mumbai')

  return (
    <div className="App">
      <p className='title'>randance</p>
      <p>quests to run to a random marker within 1km <br/><br/>and boogy with your phone</p>
      <br/>
      <ComponentWithGyroscope alpha={alpha} beta={beta} gamma={gamma}/>
      <Login setAlpha={setAlpha} setBeta={setBeta} setGamma={setGamma}/>
      <MyMap/>
    </div>
  );
}

export default App;