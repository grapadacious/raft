import express from 'express';
import { Request, Node } from './types';

const app = express();
const port = +(process.env.PORT || 3000);

const nodes: Set<string> = new Set<string>();

app.use(express.json());

app.post('/', (req: Request<Node>, res) => {
    const { node } = req.body;

    if (!(node in nodes)) {
        nodes.add(node);
    }

    console.log(`registered ${node}`);

    res.send({
        nodes: [...nodes]
    });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
