import express from 'express';

import leader from './leader';
import network from './network';
import { host, port } from './meta';
import { joinNetwork } from './registration';
import { Announce, Request } from './types';

const app = express();

app.use(express.json());

app.post('/', async (req, res) => {
    res.send({
        host
    });
});

app.post('/announce', async (req: Request<Announce>, res) => {
    const { node } = req.body;

    network.addNode(node);

    res.send();
});

app.post('/append', async (req, res) => {
    console.log('Append called');
    res.send();
});

app.listen(port, async () => {
    console.log(`Listening on port ${port}`);

    await joinNetwork();

    setInterval(leader.sendHeartbeats, 5000);
});