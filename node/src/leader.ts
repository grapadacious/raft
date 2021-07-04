import axios from 'axios';
import { address } from './meta';
import { becomeFollower } from './mode';
import network from './network';
import state from './state';
import { AppendResult, IndexedLogEntry } from './types';

const leaderState = {
    nextIndex: {} as Record<string, number>,
    matchIndex: {} as Record<string, number>
};

async function _appendEntries(node: string, entries: IndexedLogEntry[] = []) {
    const prevIndex = entries.length < 1 ? state.log.length - 1 : entries[0].index - 1;
    const prevTerm = state.log[prevIndex].term;

    const { data } = await axios.post<AppendResult>(`${node}/append`, {
        entries,
        leaderCommit: state.commitIndex,
        leader: address,
        prevLogIndex: prevIndex,
        prevLogTerm: prevTerm,
        term: state.currentTerm,
    });

    if (data.term > state.currentTerm) {
        state.currentTerm = data.term;
        becomeFollower();
        return;
    }

    if (data.success) {
        leaderState.matchIndex[node] = state.log.length - 1;
        leaderState.nextIndex[node] = leaderState.matchIndex[node] + 1;

        _checkCommits();
    } else {
        leaderState.nextIndex[node] = Math.max(1, leaderState.nextIndex[node] - 1);
    }
}

async function handleClientRequest(command: number): Promise<number[]> {
    state.log.push({
        command,
        term: state.currentTerm
    });

    for (let node of network.nodes) {
        const index = leaderState.nextIndex[node];
        const entries = state.log.map<IndexedLogEntry>((x, i) => ({
            command: x.command,
            index: i, 
            term: x.term
        })).slice(index);

        await _appendEntries(node, entries);
    }

    return state.stateMachine;
}

function initialize() {
    leaderState.matchIndex = {};
    leaderState.nextIndex = {};

    for (let node of network.nodes) {
        leaderState.matchIndex[node] = 0;
        leaderState.nextIndex[node] = state.log.length;
    }
}

function _getMajorityIndex(): number {
    const replicatedIndexes = [state.log.length - 1];

    for (let node of network.nodes) {
        replicatedIndexes.push(leaderState.matchIndex[node]);
    }

    replicatedIndexes.sort();

    const i = Math.floor(replicatedIndexes.length / 2);

    return replicatedIndexes[i];
}

function _checkCommits() {
    const majorityIndex = _getMajorityIndex();

    if (majorityIndex <= state.commitIndex) return;

    if (state.log[majorityIndex].term !== state.currentTerm) return;

    console.log(`Consensus reached to index ${majorityIndex}. Updating commit index.`);
    state.commitIndex = majorityIndex;
}

async function sendHeartbeat() {
    if (state.mode !== 'leader') return;

    for (let node of network.nodes) {
        await _appendEntries(node);
    }
}

function addNetworkNode(node: string) {
    leaderState.matchIndex[node] = 0;
    leaderState.nextIndex[node] = leaderState.matchIndex[node] + 1;
}

export default {
    handleClientRequest,
    initialize,
    sendHeartbeat,
    addNetworkNode
}