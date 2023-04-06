import { registerRegistry, sendEvent } from '../generated/Randance'
import { Fluence } from '@fluencelabs/fluence'
import { krasnodar } from '@fluencelabs/fluence-network-environment';

(async () => {

    await Fluence.start({
        connectTo: krasnodar[0]
    })

    const map = new Map()
    let event_id = 0;

    registerRegistry({
        register: (peer_id: any) => {
            map.set(peer_id, true)
            return true;
        }
    })

    setInterval(() => {
        console.log('running randance event ... ')
        // contract send to increment counter
        for (const peer of Array.from(map.keys())) {
            const res = sendEvent(krasnodar[0].peerId, peer, {id: event_id, time: 100 })
        }
        event_id++
    }, 1_0_0_0_0 /**6*60*/) // every 10 sec / every hour

    console.log('connected ', Fluence.getStatus().peerId)
})()