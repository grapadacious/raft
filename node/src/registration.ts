import axios from 'axios';

import { address } from './meta';
import { Mode } from './mode';
import network from './network';
import state from './state';
import { retry } from './util';

const registrationHost = process.env.REGISTRATION_HOST || '';
const registrationPort = process.env.REGISTRATION_PORT || '';
const registrationUrl = `http://${registrationHost}:${registrationPort}`;

interface RegistrationResult {
    nodes: string[];
}

async function announce(nodes: string[]): Promise<void> {    
    for (let node of nodes) {
        await axios.post(`${node}/announce`, {
            node: address
        });
    }
}

async function register(): Promise<string[]> {
    return await retry(async () => {
        const { data } = await axios.post<RegistrationResult>(registrationUrl, {
            node: address
        });

        return data.nodes;
    });
}

export async function joinNetwork(): Promise<void> {
    console.log('Joining network')

    const nodes = await register();

    if (nodes.length === 1) {
        console.log('First node - becoming leader');
        state.mode = Mode.LEADER;
    }

    network.addNodes(nodes);

    await announce(nodes);
}