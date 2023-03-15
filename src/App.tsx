import styles from 'App.module.scss'
import { useReducer, useState } from 'react'

interface Peer {
    conn: RTCPeerConnection
    chan?: RTCDataChannel
    enabled?: true
    // TODO: add sent messages
    receivedMessages?: string[]
}

const ICE_SERVERS: RTCIceServer[] = [{ urls: 'stun:stun1.l.google.com:19302' }]

export function App() {
    const [offer, setOffer] = useState<RTCSessionDescription | null>()
    const [reveivedOffer, setReceivedOffer] = useState<RTCSessionDescription | null>()
    const [peers, setPeers] = useState<Peer[]>([])
    const [, forceUpdate] = useReducer(x => x + 1, 0)

    return (
        <div className={styles.container}>
            <div>
                <button onClick={e => handleGenerateOffer(e)}>Generate Offer</button>
                {offer && <pre>{JSON.stringify(offer, null, 2)}</pre>}
                <form onSubmit={e => handleReceiveOffer(e)}>
                    <textarea name="offer" />
                    <button type="submit">Receive Offer</button>
                </form>
                <form onSubmit={e => handleAnswer(e)}>
                    <textarea name="answer" />
                    <button type="submit">Receive answer</button>
                </form>
                {reveivedOffer && <pre>{JSON.stringify(reveivedOffer, null, 2)}</pre>}
            </div>

            {peers
                .filter(p => p.enabled)
                .map((p, i) => (
                    <div key={i}>
                        <form onSubmit={handleSendMessage(p)}>
                            <label>
                                Enter a message:
                                <input
                                    type="text"
                                    name="message"
                                    id="message"
                                    placeholder="Message text"
                                    inputMode="text"
                                    size={60}
                                    maxLength={120}
                                />
                            </label>
                            <button type="submit">Send</button>
                        </form>
                        <div>
                            <p>Messages</p>
                            {/* TODO: render sent messages */}
                            {p.receivedMessages?.map((m, i) => (
                                <p key={i}>{m}</p>
                            ))}
                        </div>
                    </div>
                ))}
        </div>
    )

    async function handleGenerateOffer(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        // Create the local connection and its event listeners
        const conn = new RTCPeerConnection({ iceServers: ICE_SERVERS })

        const peer: Peer = { conn }

        // Create the data channel and establish its event listeners
        peer.chan = conn.createDataChannel('chan' + peers.length)
        peer.chan.onopen = handleChannelStatusChange(peer, peers.length)
        peer.chan.onclose = handleChannelStatusChange(peer, peers.length)
        peer.chan.onmessage = handleReceiveMessage(peer, peers.length)
        peer.conn.onnegotiationneeded = e => console.log('negotiation needed', e)

        // Set up the ICE candidate for the connection
        conn.onicecandidate = handleIceCandidateForOffer(peer)

        // Now create an offer to connect; this starts the process
        const desc = await conn.createOffer()
        await conn.setLocalDescription(desc)

        setPeers([...peers, peer])
    }

    async function handleReceiveOffer(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const remoteDesc = JSON.parse(e.currentTarget.offer.value)

        // Create the remote connection and its event listeners
        const conn = new RTCPeerConnection({ iceServers: ICE_SERVERS })
        const peer: Peer = { conn }
        peer.chan = conn.createDataChannel('chan' + peers.length)
        conn.ondatachannel = receiveDataChannel(peer, peers.length)
        peer.conn.onnegotiationneeded = e => console.log('negotiation needed', e)

        // Set up the ICE candidates for the two peers
        conn.onicecandidate = handleIceCandidateForAnswer(peer)

        // Now create an offer to connect; this starts the process
        await conn.setRemoteDescription(remoteDesc)
        const answer = await conn.createAnswer()
        await conn.setLocalDescription(answer)

        setPeers([...peers, peer])
    }

    async function handleAnswer(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        // TODO: find peer by identifier
        const conn = peers[0].conn
        const answer = JSON.parse(e.currentTarget.answer.value)

        await conn.setRemoteDescription(answer)
    }

    function handleSendMessage(peer: Peer) {
        return (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault()

            const message = e.currentTarget.message.value
            if (peer.chan?.readyState === 'open') {
                peer.chan.send(message)
            }
        }
    }

    function handleChannelStatusChange(peer: Peer, index: number) {
        return (event: Event) => {
            console.log('Received channel status change: ' + JSON.stringify(event))

            if (event.isTrusted) {
                peer.enabled = true
                forceUpdate()
                return
            }

            peer.chan?.close()
            peers.splice(index, 1) // remove peer from array
        }
    }

    function receiveDataChannel(peer: Peer, index: number) {
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
}
