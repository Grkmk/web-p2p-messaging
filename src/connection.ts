/* eslint-disable no-console */
import { USERNAME_SESSION_KEY } from 'App'
import { v4 as uuidV4 } from 'uuid'

export interface Peer {
    id: string
    username: string
    // 	- when creating offer, pass to signal own name
    // 	- when receiving offer, set from offer signal
    // 	- when receiving answer, set from answer signal
    conn: RTCPeerConnection
    chan?: RTCDataChannel
    enabled?: boolean
    messages?: Message[]
}

export interface Signal {
    id: string
    username: string
    description: RTCSessionDescriptionInit
}

interface Message {
    data: string
    date: string // should be parseable Date
    sentOrReceived: 'sent' | 'received'
}

const ICE_SERVERS: RTCIceServer[] = [{ urls: 'stun:stun1.l.google.com:19302' }]

/**
 Creates a new Peer and generates an offer to connect to another Peer.
 @param onSuccess Callback function to execute on successful offer creation.
 @param onChange Callback function to execute on channel status changes.
 @param tempName Name to be used as the Peer's username until updated by the answer signal.
 @returns The newly created Peer instance.
 */
export async function createPeerToOffer(onSuccess: (offer: Signal) => void, onChange: () => void, tempName: string) {
    // Create the local connection and its event listeners
    const conn = new RTCPeerConnection({ iceServers: ICE_SERVERS })

    const peer: Peer = { id: uuidV4(), username: tempName, conn }

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

/**
 Creates a new Peer and responds to an offer to connect from another Peer.
 @param offer The offer signal received from the other Peer.
 @param onSuccess Callback function to execute on successful answer creation.
 @param onChange Callback function to execute on channel status changes.
 @returns The newly created Peer instance.
 */
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

/**
 Handles receiving an answer signal from another Peer and sets the remote description for the connection.
 @param peer The Peer instance to receive the answer.
 @param answer The answer signal received from the other Peer.
 */
export async function receiveAnswer(peer: Peer, answer: Signal) {
    peer.username = answer.username
    await peer.conn.setRemoteDescription(answer.description)
}

/**
 Sends a message over a Peer's RTCDataChannel.
 @param peer The Peer instance to send the message.
 @param data The message to send.
 @param onSuccess Callback function to execute on successful message sending.
 */
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

/**
 * A function that validates the user signal input for the WebRTC connection
 * @param signal
 * @returns {boolean}
 */
export function isOfSignalInterface(signal: unknown) {
    if (typeof signal !== 'object' || signal === null) {
        return false
    }

    if (!('id' in signal) || !('username' in signal) || !('description' in signal)) {
        return false
    }

    if (
        typeof signal.id !== 'string' ||
        typeof signal.username !== 'string' ||
        typeof signal.description !== 'object'
    ) {
        return false
    }

    if (!signal.id || !signal.username || !signal.description) {
        return false
    }

    if (!('type' in signal.description) || !('sdp' in signal.description)) {
        return false
    }

    if (typeof signal.description.type !== 'string' || typeof signal.description.sdp !== 'string') {
        return false
    }

    return true
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
                username: sessionStorage.getItem(USERNAME_SESSION_KEY) || 'Invalid Name',
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
                username: sessionStorage.getItem(USERNAME_SESSION_KEY) || 'Invalid Name',
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
    peer.messages?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
