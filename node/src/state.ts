import { Mode } from "./mode";

class State {
    mode: Mode;

    constructor(mode: Mode) {
        this.mode = mode;
    }
}

const state = new State(Mode.FOLLOWER);

export default state;