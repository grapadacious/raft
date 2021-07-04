import { LogEntry } from "./types";

class State {
    private _commitIndex: number;
    currentTerm: number;
    lastApplied: number;
    leader: string | null;
    log: LogEntry[];
    mode: 'candidate' | 'follower' | 'leader';
    stateMachine: number[];
    votedFor: string | null;

    constructor(mode: 'candidate' | 'follower' | 'leader') {
        this._commitIndex = 0;
        this.currentTerm = 0;
        this.lastApplied = 0;
        this.leader = null;
        this.log = [{
            command: 0,
            term: 0
        }];
        this.mode = mode;
        this.stateMachine = [];
        this.votedFor = null;
    }

    get commitIndex(): number {
        return this._commitIndex;
    }

    set commitIndex(value: number) {
        this._commitIndex = value;
        this._applyEntries();
    }

    private _applyEntries() {
        while (this.lastApplied < this.commitIndex) {
            this.lastApplied++;

            const command = this.log[this.lastApplied].command;

            this.stateMachine.push(command);
        }
    }
}

const state = new State('follower');

export default state;