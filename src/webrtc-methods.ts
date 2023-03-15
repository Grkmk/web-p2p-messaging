interface Peer {
    conn: RTCPeerConnection
    chan?: RTCDataChannel
    enabled?: true
    // TODO: add sent messages
    receivedMessages?: string[]
}

const ICE_SERVERS: RTCIceServer[] = [{ urls: 'stun:stun1.l.google.com:19302' }]

export async function handleGenerateOffer(locationIndex: number) {
    // Create the local connection and its event listeners
    const conn = new RTCPeerConnection({ iceServers: ICE_SERVERS })

    const peer: Peer = { conn }

    // Create the data channel and establish its event listeners
    peer.chan = conn.createDataChannel('chan' + locationIndex)
    peer.chan.onopen = handleChannelStatusChange(peer, locationIndex)
    peer.chan.onclose = handleChannelStatusChange(peer, locationIndex)
    peer.chan.onmessage = handleReceiveMessage(peer, locationIndex)
    peer.conn.onnegotiationneeded = e => console.log('negotiation needed', e)

    // Set up the ICE candidate for the connection
    conn.onicecandidate = handleIceCandidateForOffer(peer)

    // Now create an offer to connect; this starts the process
    const desc = await conn.createOffer()
    await conn.setLocalDescription(desc)

    return peer
}

export async function handleReceiveOffer(
    remoteDesc: RTCSessionDescriptionInit,
    locationIndex: number,
    onEnable: () => void
) {
    // Create the remote connection and its event listeners
    const conn = new RTCPeerConnection({ iceServers: ICE_SERVERS })
    const peer: Peer = { conn }
    peer.chan = conn.createDataChannel('chan' + locationIndex)
    conn.ondatachannel = receiveDataChannel(peer, locationIndex, onEnable)
    peer.conn.onnegotiationneeded = e => console.log('negotiation needed', e)

    // Set up the ICE candidates for the two peers
    conn.onicecandidate = handleIceCandidateForAnswer(peer)

    // Now create an offer to connect; this starts the process
    await conn.setRemoteDescription(remoteDesc)
    const answer = await conn.createAnswer()
    await conn.setLocalDescription(answer)

    return peer
}

export async function handleAnswer(answer: RTCSessionDescriptionInit, peer: Peer) {
    await peer.conn.setRemoteDescription(answer)
}

function handleSendMessage(peer: Peer, message: string) {
    if (peer.chan?.readyState === 'open') {
        peer.chan.send(message)
    }
}

function handleChannelStatusChange(peer: Peer, onEnable: () => void) {
    return (event: Event) => {
        console.log('Received channel status change: ' + JSON.stringify(event))

        if (event.isTrusted) {
            peer.enabled = true
            onEnable()
            return
        }

        peer.chan?.close()
    }
}

function receiveDataChannel(peer: Peer, index: number, onEnable: () => void) {
    return (event: RTCDataChannelEvent) => {
        console.log('Received datachannel: ' + JSON.stringify(event))

        peer.chan = event.channel
        peer.chan.onmessage = handleReceiveMessage(peer, index)
        peer.chan.onopen = handleChannelStatusChange(peer, index)
        peer.chan.onclose = handleChannelStatusChange(peer, index)
    }
}

function handleIceCandidateForOffer(peer: Peer) {
    return (event: RTCPeerConnectionIceEvent) => {
        console.log('Received ICE for offer: ' + JSON.stringify(event))

        if (event.candidate) {
            peer.conn.addIceCandidate(event.candidate)
        }

        if (event.isTrusted) {
            // TODO: pass local identifier to remote peer
            setOffer(peer.conn.localDescription)
        }
    }
}

function handleIceCandidateForAnswer(peer: Peer) {
    return (event: RTCPeerConnectionIceEvent) => {
        console.log('Received ICE for answer: ' + JSON.stringify(event))

        if (event.candidate) {
            peer.conn.addIceCandidate(event.candidate)
        }

        if (event.isTrusted) {
            // TODO: pass received identifier to remote peer
            setReceivedOffer(peer.conn.localDescription)
        }
    }
}

function handleReceiveMessage(peer: Peer, index: number) {
    return (event: MessageEvent) => {
        console.log('Received message: ' + JSON.stringify(event))

        if (event.isTrusted) {
            peer.receivedMessages = [...(peer.receivedMessages || []), event.data]
            forceUpdate()
        }
    }
}
