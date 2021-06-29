import axios from 'axios';
import { address } from './meta';
import { Mode } from './mode';
import network from './network';
import state from './state';

function isLeader() {
    return state.mode === Mode.LEADER;
}

async function sendHeartbeat(node: string) {
    await axios.post(`${node}/append`, {});
}

export async function sendHeartbeats() {
    if (!isLeader()) return;

    for (let node of network.nodes) {
        await sendHeartbeat(node);
    }
}

export default {
    sendHeartbeats
}