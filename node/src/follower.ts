import { becomeFollower } from './mode';
import scheduler from './scheduler';
import state from './state';
import {
    Append,
    AppendResult,
    IndexedLogEntry,
} from './types';

function conflictingEntry(entries: IndexedLogEntry[]): number {
    let result = state.log.length;

    for (let entry of entries) {
        if (entry.index < result && entry.term !== state.log[entry.index].term) {
            result = entry.index;
        }
    }

    return result;
}

function handleAppendRequest(body: Append): AppendResult {
    console.log(`append entries: ${JSON.stringify(body)}`);

    if (body.term > state.currentTerm) {
        state.currentTerm = body.term;
        becomeFollower();
    }
    
    if (body.term < state.currentTerm) {
        return {
            term: state.currentTerm,
            success: false
        };
    }
    
    if (state.mode === 'candidate' || state.mode === 'leader') {
        becomeFollower();
    }

    if (state.leader !== body.leader) {
        state.leader = body.leader;
    }

    scheduler.resetElectionTimer();

    if (state.log.length - 1 < body.prevLogIndex || state.log[body.prevLogIndex].term !== body.prevLogTerm) {
        return {
            term: state.currentTerm,
            success: false
        };
    }

    const conflictIndex = conflictingEntry(body.entries);
    if (conflictIndex < state.log.length) {
        state.log.splice(conflictIndex);
    }

    if (body.entries.length > 0) {
        state.log.push(...body.entries.map(x => ({
            term: x.term,
            command: x.command
        })));
    }

    if (body.leaderCommit > state.commitIndex) {
        state.commitIndex = Math.min(body.leaderCommit, state.log.length - 1);
    }

    return {
        term: state.currentTerm,
        success: true
    };
}

export default {
    handleAppendRequest
}