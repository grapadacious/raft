# Raft

This is an implementation of the Raft consensus algorithm outlined in [this paper](https://raft.github.io/raft.pdf). This implementation uses Docker and Docker Compose to provide scalability and networking and establishes a peer-to-peer network using a network registry service and announce protocol.

## Starting the Network

You can start a three node network by running `docker compose build` followed by `docker compose up --scale node=3`. The number of nodes can be changed by modifying the second command accordingly.

## Making Client Requests

You can make client requests to the network by making a POST request to `http://localhost:5000/node` with a body in the structure:

```
{
  "command": 1
}
```

The number for the command can be any number. Once the request is handled, the command will be applied to the state machine, and the updated state machine will be returned in the response.
