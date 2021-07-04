import { randomInt } from 'crypto';
import leader from './leader';

class Scheduler {
    private _electionTimer: NodeJS.Timeout | null;
    private _heartbeatTimer: NodeJS.Timeout | null;

    constructor() {
        this._electionTimer = null;
        this._heartbeatTimer = null;
    }

    clearElectionTimer() {
        if (this._electionTimer === null) return;

        clearTimeout(this._electionTimer);

        this._electionTimer = null;
    }

    clearHeartbeatTimer() {
        if (this._heartbeatTimer === null) return;

        clearTimeout(this._heartbeatTimer);

        this._heartbeatTimer = null;
    }

    get hasElectionTimer() {
        return this._electionTimer !== null;
    }

    get hasHeartbeatTimer() {
        return this._heartbeatTimer !== null;
    }

    resetElectionTimer() {
        const duration = randomInt(8000, 16000);

        this.clearElectionTimer();

        this._electionTimer = setTimeout(() => {

        }, duration);
    }

    resetHeartbeatTimer() {
        const duration = 5000;

        this.clearHeartbeatTimer();

        this._heartbeatTimer = setTimeout(async () => {
            await leader.sendHeartbeat();
            this.resetHeartbeatTimer();
        }, duration);
    }

    // Used when a node becomes the leader to send initial heartbeat 
    async startHeartbeatTimer() {
        await leader.sendHeartbeat();

        this.resetHeartbeatTimer();
    }
}

const scheduler = new Scheduler();

export default scheduler;