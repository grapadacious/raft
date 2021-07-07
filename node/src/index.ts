import express from 'express';

import election from './election';
import follower from './follower';
import leader from './leader';
import network from './network';
import { address, port } from './meta';
import { joinNetwork } from './registration';
import {
    Announce,
    Append,
    ClientBody,
    ClientResult,
    Request,
    RequestVote
} from './types';
import state from './state';
import axios from 'axios';

const app = express();

app.use(express.json());

app.post('/', async (req: Request<ClientBody>, res) => {
    const { command } = req.body;

    if (state.leader === address) {
        const stateMachine = await leader.handleClientRequest(command);

        return res.send({ stateMachine });
    }

    if (state.leader == null) {
        return res.status(404).send();
    }

    const { data } = await axios.post<ClientResult>(state.leader, {
        command
    });

    res.send(data);
});

app.post('/announce', async (req: Request<Announce>, res) => {
    const { node } = req.body;

    if (state.leader === address) {
        leader.addNetworkNode(node);
    }

    network.addNode(node);

    res.send();
});

app.post('/append', async (req: Request<Append>, res) => {
    const result = await follower.handleAppendRequest(req.body);

    res.send(result);
});

app.post('/request-vote', async (req: Request<RequestVote>, res) => {
    const result = await election.handleVoteRequest(req.body);

    res.send(result);
});

app.listen(port, async () => {
    console.log(`Listening on port ${port}`);

    await joinNetwork();
});