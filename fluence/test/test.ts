import { registerRandance, registerPeer } from '../generated/Randance'
import { Fluence } from '@fluencelabs/fluence'
import { krasnodar } from '@fluencelabs/fluence-network-environment';

(async (HUB_PEER_ID: any) => {

    await Fluence.start({
        connectTo: krasnodar[0]
    })

    const map = new Map()
    let event_id = 0;

    registerRandance({
        send: (event: any) => {
            console.log(event)
            return true;
        }
    })

    const res = await registerPeer(HUB_PEER_ID, Fluence.getStatus().peerId)
    console.log('registered ', res)

    console.log('connected ', Fluence.getStatus().peerId)
})("12D3KooWG2oUR7wyqFzKR5X5Y9tZHbFzLhjjUowmA11EF5GtLm6d")