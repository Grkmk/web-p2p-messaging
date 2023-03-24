/* eslint-disable no-console */
import { v4 as uuidV4 } from 'uuid'

export interface Peer {
    id: string
    // TODO: add username
    username: string
    // 	- when creating offer, pass to signal own name
    // 	- when receiving offer, set from offer signal
    // 	- when receiving answer, set from answer signal
    conn: RTCPeerConnection
    chan?: RTCDataChannel
    enabled?: true
    messages?: Message[]
}

export interface Signal {
    id: string
    // TODO: add username (should always be overwritten with sender's name)
    username: string
    description: RTCSessionDescriptionInit
}

interface Message {
    data: string
    date: string // should be parseable Date
    sentOrReceived: 'sent' | 'received'
}

const ICE_SERVERS: RTCIceServer[] = [{ urls: 'stun:stun1.l.google.com:19302' }]

export async function createPeerToOffer(onSuccess: (offer: Signal) => void, onChange: () => void) {
    // Create the local connection and its event listeners
    const conn = new RTCPeerConnection({ iceServers: ICE_SERVERS })

    const peer: Peer = { id: uuidV4(), username: 'not yet set', conn }
    //peer.username = sessionStorage.getItem('username') || 'Anonymous'
    console.log(peer.username + ' should be ' + sessionStorage.getItem('username'))
    console.log('Create Peer to Offer Function')

    // Create the data channel and establish its event listeners
    peer.chan = conn.createDataChannel('chan' + peer.id)
    peer.chan.onopen = handleChannelStatusChange(peer, onChange)
    peer.chan.onclose = handleChannelStatusChange(peer, onChange)
    peer.chan.onmessage = handleReceiveMessage(peer, onChange)
    peer.conn.onnegotiationneeded = handleOnNegotiationNeeded(peer)

    // Set up the ICE candidate for the connection
    conn.onicecandidate = handleIceCandidateForOffer(peer, onSuccess)

    // Now create an offer to connect; this starts the process
    const desc = await conn.createOffer()
    await conn.setLocalDescription(desc)

    return peer
}

export async function createPeerFromOffer(offer: Signal, onSuccess: (answer: Signal) => void, onChange: () => void) {
    // Create the remote connection and its event listeners
    const conn = new RTCPeerConnection({ iceServers: ICE_SERVERS })
    const peer: Peer = { id: offer.id, username: offer.username, conn }
    peer.chan = conn.createDataChannel('chan' + peer.id)
    conn.ondatachannel = receiveDataChannel(peer, onChange)
    peer.conn.onnegotiationneeded = handleOnNegotiationNeeded(peer)

    // Set up the ICE candidates for the two peers
    conn.onicecandidate = handleIceCandidateForAnswer(peer, onSuccess)

    // Now create an offer to connect; this starts the process
    await conn.setRemoteDescription(offer.description)
    const answer = await conn.createAnswer()
    await conn.setLocalDescription(answer)

    return peer
}

export async function receiveAnswer(peer: Peer, answer: Signal) {
    peer.username = answer.username
    await peer.conn.setRemoteDescription(answer.description)
}

export function sendMessage(peer: Peer, data: string, onSuccess: () => void) {
    const message: Message = {
        data,
        date: new Date().toISOString(),
        sentOrReceived: 'sent',
    }

    if (peer.chan?.readyState === 'open') {
        peer.chan.send(JSON.stringify(message))
        peer.messages = [...(peer.messages || []), message]
        sortMessages(peer)
        onSuccess()
    }
}

function handleChannelStatusChange(peer: Peer, onChange: () => void) {
    return (event: Event) => {
        console.log('Received channel status change: ' + JSON.stringify(event))

        if (event.isTrusted) {
            peer.enabled = true
            onChange()
            return
        }

        peer.chan?.close()
    }
}

function receiveDataChannel(peer: Peer, onChange: () => void) {
    return (event: RTCDataChannelEvent) => {
        console.log('Received datachannel: ' + JSON.stringify(event))

        peer.chan = event.channel
        peer.chan.onmessage = handleReceiveMessage(peer, onChange)
        peer.chan.onopen = handleChannelStatusChange(peer, onChange)
        peer.chan.onclose = handleChannelStatusChange(peer, onChange)
    }
}

function handleIceCandidateForOffer(peer: Peer, onSuccess: (signal: Signal) => void) {
    return (event: RTCPeerConnectionIceEvent) => {
        console.log('Received ICE for offer: ' + JSON.stringify(event))

        if (event.candidate) {
            peer.conn.addIceCandidate(event.candidate)
        }

        if (event.isTrusted) {
            onSuccess({
                id: peer.id,
                username: sessionStorage.getItem('username') || 'Invalid Name',
                description: peer.conn.localDescription as RTCSessionDescriptionInit,
            })
        }
    }
}

function handleIceCandidateForAnswer(peer: Peer, onSuccess: (signal: Signal) => void) {
    return (event: RTCPeerConnectionIceEvent) => {
        console.log('Received ICE for answer: ' + JSON.stringify(event))

        if (event.candidate) {
            peer.conn.addIceCandidate(event.candidate)
        }

        if (event.isTrusted) {
            onSuccess({
                id: peer.id,
                username: sessionStorage.getItem('username') || 'Invalid Name',
                description: peer.conn.localDescription as RTCSessionDescriptionInit,
            })
        }
    }
}

function handleReceiveMessage(peer: Peer, onChange: () => void) {
    return (event: MessageEvent) => {
        console.log('Received message: ' + JSON.stringify(event))

        if (event.isTrusted) {
            const message: Message = JSON.parse(event.data)
            message.sentOrReceived = 'received'

            peer.messages = [...(peer.messages || []), message]
            sortMessages(peer)
            onChange()
        }
    }
}

function handleOnNegotiationNeeded(peer: Peer) {
    return (event: Event) => {
        console.log('Received negotiation needed: ' + JSON.stringify(event))
    }
}

function sortMessages(peer: Peer) {
    peer.messages?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}
