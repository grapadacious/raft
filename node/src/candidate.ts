import axios from "axios";
import { address } from "./meta";
import { becomeLeader } from "./mode";
import network from "./network";
import state from "./state";
import { RequestVoteResult } from "./types";


async function requestVote(node: string): Promise<RequestVoteResult> {
    const lastLogIndex = state.log.length - 1;
    const lastLogTerm = state.log[lastLogIndex].term;

    const { data } = await axios.post<RequestVoteResult>(`${node}/request-vote`, {
        term: state.currentTerm,
        candidate: address,
        lastLogIndex,
        lastLogTerm
    });

    return data;
}

async function requestVotes() {
    let votes = 1;

    const threshold = network.nodes.length / 2;

    for (let node of network.nodes) {
        const result = await requestVote(node);

        if (result.voteGranted) {
            votes += 1;
        } else if (result.term > state.currentTerm) {
            state.currentTerm = result.term;
            return;
        }

        if (votes >= threshold) {
            console.log('Vote threshold reached. Ending election.');
            becomeLeader();
            return;
        }
    }
}

export default {
    requestVotes
}