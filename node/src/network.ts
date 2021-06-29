import { address } from "./meta";

interface Network {
    nodes: ReadonlyArray<string>;
    addNode: (node: string) => void;
    addNodes: (nodes: string[]) => void;
}

const nodes: string[] = [];

function hasNode(node: string): boolean {
    return nodes.some(x => x === node);
}

function addNode(node: string) {
    if (hasNode(node)) return;
    if (node === address) return;

    nodes.push(node);
}

function addNodes(nodes: string[]) {
    for (let node of nodes) {
        addNode(node);
    }
}

const network: Network = {
    addNode,
    addNodes,
    nodes
};

export default network;
