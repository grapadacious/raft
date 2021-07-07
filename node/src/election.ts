import candidate from './candidate';
import { address } from './meta';
import { becomeFollower } from './mode';
import scheduler from './scheduler';
import state from './state';
import { RequestVote, RequestVoteResult } from './types';

async function handleVoteRequest(body: RequestVote): Promise<RequestVoteResult> {

    if (body.term > state.currentTerm) {
        state.currentTerm = body.term;
        becomeFollower();
    }

    if (body.term < state.currentTerm) {
        return {
            term: state.currentTerm,
            voteGranted: false
        };
    }

    const lastLogIndex = state.log.length - 1;
    const lastLogTerm = state.log[lastLogIndex].term;

    const canVoteForCandidate = state.votedFor === null || state.votedFor === body.candidate;
    const hasNewerOrSameTerm = body.lastLogTerm >= lastLogTerm;
    const hasCurrentLog = body.lastLogTerm === lastLogTerm && body.lastLogIndex >= lastLogIndex;

    if (canVoteForCandidate && (hasNewerOrSameTerm || hasCurrentLog)) {
        state.votedFor = body.candidate;
        scheduler.resetElectionTimer();
        console.log(`Voting for ${body.candidate}`);
        return {
            term: state.currentTerm,
            voteGranted: true
        }
    }

    return {
        term: state.currentTerm,
        voteGranted: false
    };
}

async function start() {
    if (state.mode === 'leader') return;

    console.log('Election timeout exceeded. Starting election.');

    state.mode = 'candidate';
    state.currentTerm += 1;
    state.votedFor = address;

    await candidate.requestVotes();
}

export default {
    handleVoteRequest,
    start
}