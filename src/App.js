import React, {useState} from 'react';
import './App.css';
import { ethers } from "ethers";
// import { Fluence } from '@fluencelabs/fluence'
import { sequence } from '0xsequence'
import { registerRandance, registerPeer } from './generated/Randance'
import randance_login from './randance_login.png'
import { Map, Marker, GeoJson, ZoomControl, GeoJsonFeature} from "pigeon-maps"
import { stamenToner } from 'pigeon-maps/providers'
import Modal from 'react-modal';
import { geolib } from 'geolib';

const { abi } = require('./abi.js')

const VERSION = 2

// import { krasnodar } from '@fluencelabs/fluence-network-environment'

Modal.setAppElement('#root');

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const TIME = 5000
// const HUB_PEER_ID = '12D3KooWHpNgjsutuhQN4Woe5wLrWVfCMdVQKaeJx5wcJr2n78ha'

const claimNFT = async () => {

  const res = fetch('http://localhost:3000', {
    method: 'POST', 
    body: JSON.stringify({
      walletAddress: localStorage.getItem('walletAddress'), 
      ethAuthProofString: localStorage.getItem('proof')
    })
  })
  console.log(res)
}

function within100Meters(point1, point2) {
  const distance = geolib.getDistance(point1, point2);
  return distance <= 100;
}

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

            navigator.geolocation.getCurrentPosition(async (position) => {

              // setCenter([position.coords.latitude, position.coords.longitude])
              const point1 = {longitude: position.coords.latitude, latitude: position.coords.longitude}
              // const currentIndex = await getCurrentIndex();
              const point2 = {longitude: props.quest[0], latitude: props.quest[1]}

              alert(JSON.stringify([point1, point2]))

              if (within100Meters(point1, point2)) {
                console.log('The points are within 100 meters.');
                alert('success!')
              } else {
                alert('The points are more than 100 meters apart.')
                console.log('The points are more than 100 meters apart.');
              }
            }, function() {
              console.log('error')
              alert('error')
            }, {timeout:10000});
            setAirdrop(true)
            document.body.style.backgroundColor = 'cyan'
            props.setColorBackground(true)
          }else {
            setAirdrop(false)
            document.body.style.backgroundColor = 'white'
            props.setColorBackground(false)
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

async function getCurrentBlock() {
  const provider = new ethers.providers.JsonRpcProvider('https://nodes.sequence.app/mumbai'); // initialize the provider
  const blockNumber = await provider.getBlockNumber(); // get the current block number
  return blockNumber;
}

const getActiveTillBlock = async () => {
  const contractAddress = '0x38D79d241D562CBc3d9dd83ff2a2c6dB79C17970'; // address of the deployed contract
  const provider = new ethers.providers.JsonRpcProvider('https://nodes.sequence.app/mumbai'); // replace with your own provider
  const contract = new ethers.Contract(contractAddress, abi, provider);
  const activeTill = await contract.activeTill()
  return Number(activeTill)
}

const getCurrentIndex = async () => {
  const contractAddress = '0x38D79d241D562CBc3d9dd83ff2a2c6dB79C17970'; // address of the deployed contract
  const provider = new ethers.providers.JsonRpcProvider('https://nodes.sequence.app/mumbai'); // replace with your own provider
  const contract = new ethers.Contract(contractAddress, abi, provider);
  const tokenIndex = await contract.tokenIdCounter()
  return Number(tokenIndex)
}

const listenToDrops = async (openModal, setQuest, setPlaying, setWaiting) => {
  setInterval(async () => {
    const currentBlock = await getCurrentBlock()
    let activeTillBlock = await getActiveTillBlock()
    console.log(currentBlock)
    console.log(activeTillBlock)
    activeTillBlock = currentBlock + 1
    let tokenIndex = await getCurrentIndex();

    console.log(currentBlock < activeTillBlock)
    console.log()
    if(currentBlock < activeTillBlock && localStorage.getItem(tokenIndex) == null && isLoggedIn){
      console.log('ready')
      setPlaying(true)
      openModal()
    }else {
      // activeTillBlock = activeTillBlock - 10
      if(currentBlock < activeTillBlock && isLoggedIn){
        console.log('pending')
        setPlaying(true)
        setWaiting(false)

      }else if(isLoggedIn) {
        console.log('complete')
        // setQuest(null)
        setPlaying(false)
        if(localStorage.getItem(tokenIndex) != null) setWaiting(true)
      }
      console.log('not ready')
      console.log(isLoggedIn)
      // setWaiting(true)
    }
    // if())
  }, 1000)
}

let hack = false;
let isLoggedIn = false

const retrieveQuestFromStorage = async (setQuest) => {
  const tokenIndex = await getCurrentIndex();

  console.log(localStorage.getItem(tokenIndex))
  setQuest(JSON.parse(localStorage.getItem(tokenIndex)))
}

function RandMap(props) {

  // const [quest, setQuest] = useState(null)
  const [center, setCenter] = useState(null)
  const [hue1, setHue1] = useState(50)
  const [hue2, setHue2] = useState(100)
  const color1 = `hsl(${hue1 % 360}deg 39% 70%)`
  const color2 = `hsl(${hue2 % 360}deg 39% 70%)`
  const [init, setInit] = useState()

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
    if(!hack){
      // connectClient()
      listenToDrops(openModal, props.setQuest, props.setPlaying, props.setWaiting, isLoggedIn)
      hack=true;
    }
  }, [])

  React.useEffect(() => {
    if(isLoggedIn && props.isPlaying) retrieveQuestFromStorage(props.setQuest)
  })

  // const connectClient = async () => {
  //   await Fluence.start({
  //     connectTo: krasnodar[0]
  //   })
  //   console.log('connected -> ', Fluence.getStatus().peerId)
  //   registerRandance({
  //     send: async (event) => {
  //       console.log(event)
  //       setQuest(getRandomSpot(center[0], center[1]))
  //       return true
  //     }
  //   })
  // }

  React.useEffect(() => {
    // setTimeout(() => {
      // openModal()
    // }, 2000)
    navigator.geolocation.getCurrentPosition(function(position) {
      setCenter([position.coords.latitude, position.coords.longitude])
    }, function() {
      console.log('error')
    }, {timeout:10000});
  }, [])

  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }

  const accept = async () => {

    console.log('accept quest')

    const tokenIndex = await getCurrentIndex();
    //TODO for testing
    const randomQuest = [center[0], center[1]]
    // const randomQuest = getRandomSpot(center[0], center[1])

    props.setQuest(randomQuest)
    console.log(Number(tokenIndex))
    if(localStorage.getItem(Number(tokenIndex)) == null) {
      console.log('accepting')
      localStorage.setItem(Number(tokenIndex), JSON.stringify(randomQuest))
    }
    closeModal()
  }

  return (
      <> 
      <Modal
      isOpen={modalIsOpen}
      onAfterOpen={afterOpenModal}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Example Modal"
    >
      {/* <button onClick={closeModal}>close</button> */}
      <div>
        <div>ATTN::!?// A new randance quest is available to unlock an NFT. <br/><br/>Would you like to participate?</div>
        <p style={{fontSize: '8.8px'}}>caution: we are not liable for any injury during randance</p>
        <br/><br/>
        <button className='accept' onClick={accept}>accept  </button>
      </div>
    </Modal>
    {center ? (
        <>
        <Map provider={stamenToner} height={300} defaultCenter={center} defaultZoom={15}>
        { props.quest ? <Marker 
          width={50}
          anchor={props.quest} 
          color={color2} 
          onClick={() => setHue2(hue2 + 20)} 
        /> : null}
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

  const click = async () => {
    console.log(DeviceMotionEvent)

    const requestPermission = (DeviceOrientationEvent).requestPermission;

    if (typeof requestPermission  === 'function') {
      // Handle iOS 13+ devices.
      const state = await requestPermission()
      if (state === 'granted') {
        window.addEventListener('devicemotion', handleOrientation);
      } else {
        console.error('Request to access the orientation was rejected');
      }
      return 
    } else {
      // Handle regular non iOS 13+ devices.
      window.addEventListener('devicemotion', handleOrientation);
    }
  }

  const login = async () => {
    await click()

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
    localStorage.setItem('walletAddress', connectDetails.session.accountAddress)
    // const res = await registerPeer(HUB_PEER_ID)
    if(connectDetails.session.accountAddress) isLoggedIn = true
    // console.log(res)
  }
  return (
    <>
    <img onClick={login} className="login" src={randance_login} />
    </>
  )
}

function App() {

  const [alpha, setAlpha] = React.useState(0)
  const [beta, setBeta] = React.useState(0)
  const [gamma, setGamma] = React.useState(0)
  const [colorBackground, setColorBackground] = React.useState(false)
  const [playing, setPlaying] = React.useState(false)
  const [waiting, setWaiting] = React.useState(false)
  const [quest, setQuest] = React.useState(null)
  sequence.initWallet('mumbai')

  return (
    <div className="App">
      <p className='title'>randance</p>
      <p>quests to run to a random marker within 1km <br/><br/>and boogy with your phone {!isLoggedIn ? <><br/><br/><p>you must be logged in to play</p> </>: null} </p>
      <br/>
      { waiting ? <p>awaiting quest ...</p> : null}
      { playing ? <ComponentWithGyroscope setColorBackground={setColorBackground} alpha={alpha} beta={beta} gamma={gamma}/> : null}
      <br/>
      {!colorBackground ? <Login setAlpha={setAlpha} setBeta={setBeta} setGamma={setGamma}/> : null}
      <RandMap quest={quest} setQuest={setQuest} isPlaying={playing} setPlaying={setPlaying} setWaiting={setWaiting} isLoggedIn={isLoggedIn}/>
      <p>v0.{VERSION}</p>
    </div>
  );
}

export default App;