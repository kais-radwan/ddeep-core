function listen (soul, peer) {
    if (peer && soul) process.PEERS[process.PEERS.indexOf(peer)].listeners.push(...soul);
}

module.exports = listen;