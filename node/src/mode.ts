import leader from './leader';
import { address } from './meta';
import scheduler from './scheduler';
import state from './state';

export function becomeLeader() {
    if (state.mode === 'leader') return;

    console.log('Becoming leader');

    state.mode = 'leader';

    state.leader = address;
    state.votedFor = null;

    leader.initialize();

    scheduler.clearElectionTimer();
    scheduler.startHeartbeatTimer();
}

export function becomeFollower() {
    if (state.mode === 'follower') return;

    console.log('Becoming follower');

    state.mode = 'follower';

    if (scheduler.hasHeartbeatTimer) {
        scheduler.clearHeartbeatTimer();
    }

    if (!scheduler.hasElectionTimer) {
        scheduler.resetElectionTimer();
    }
}