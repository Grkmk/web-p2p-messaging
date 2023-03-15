import styles from 'App.module.scss'
import { useReducer, useState } from 'react'
import { v4 as uuidV4 } from 'uuid'

interface Peer {
    id: string
    conn: RTCPeerConnection
    chan?: RTCDataChannel
    enabled?: true
    messages?: Message[]
}

interface Signal {
    id: string
    description: RTCSessionDescriptionInit
}

interface Message {
    data: string
    date: string // should be parseable Date
    sentOrReceived: 'sent' | 'received'
}

const ICE_SERVERS: RTCIceServer[] = [{ urls: 'stun:stun1.l.google.com:19302' }]

export function App() {
    const [offer, setOffer] = useState<Signal | null>()
    const [reveivedOffer, setReceivedOffer] = useState<Signal | null>()
    const [peers] = useState<Record<string, Peer>>({})
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

            {Object.values(peers)
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
                            <h3>Messages</h3>
                            {p.messages?.map((m, i) => (
                                <p key={i}>
                                    {m.sentOrReceived} on {new Date(m.date).toLocaleString()}: {m.data}
                                </p>
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

        const peer: Peer = { id: uuidV4(), conn }

        // Create the data channel and establish its event listeners
        peer.chan = conn.createDataChannel('chan' + peer.id)
        peer.chan.onopen = handleChannelStatusChange(peer)
        peer.chan.onclose = handleChannelStatusChange(peer)
        peer.chan.onmessage = handleReceiveMessage(peer)
        peer.conn.onnegotiationneeded = handleOnNegotiationNeeded(peer)

        // Set up the ICE candidate for the connection
        conn.onicecandidate = handleIceCandidateForOffer(peer)

        // Now create an offer to connect; this starts the process
        const desc = await conn.createOffer()
        await conn.setLocalDescription(desc)

        peers[peer.id] = peer
        forceUpdate()
    }

    async function handleReceiveOffer(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const signalOffer: Signal = JSON.parse(e.currentTarget.offer.value)

        // Create the remote connection and its event listeners
        const conn = new RTCPeerConnection({ iceServers: ICE_SERVERS })
        const peer: Peer = { id: signalOffer.id, conn }
        peer.chan = conn.createDataChannel('chan' + peer.id)
        conn.ondatachannel = receiveDataChannel(peer)
        peer.conn.onnegotiationneeded = handleOnNegotiationNeeded(peer)

        // Set up the ICE candidates for the two peers
        conn.onicecandidate = handleIceCandidateForAnswer(peer)

        // Now create an offer to connect; this starts the process
        await conn.setRemoteDescription(signalOffer.description)
        const answer = await conn.createAnswer()
        await conn.setLocalDescription(answer)

        peers[peer.id] = peer
        forceUpdate()
    }

    async function handleAnswer(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const signalAnswer: Signal = JSON.parse(e.currentTarget.answer.value)
        const peer = peers[signalAnswer.id]

        await peer.conn.setRemoteDescription(signalAnswer.description)
    }

    function handleSendMessage(peer: Peer) {
        return (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault()

            const message: Message = {
                data: e.currentTarget.message.value as string,
                date: new Date().toISOString(),
                sentOrReceived: 'sent',
            }

            if (peer.chan?.readyState === 'open') {
                peer.chan.send(JSON.stringify(message))
            }
        }
    }

    function handleChannelStatusChange(peer: Peer) {
        return (event: Event) => {
            console.log('Received channel status change: ' + JSON.stringify(event))

            if (event.isTrusted) {
                peer.enabled = true
                forceUpdate()
                return
            }

            peer.chan?.close()
        }
    }

    function receiveDataChannel(peer: Peer) {
        return (event: RTCDataChannelEvent) => {
            console.log('Received datachannel: ' + JSON.stringify(event))

            peer.chan = event.channel
            peer.chan.onmessage = handleReceiveMessage(peer)
            peer.chan.onopen = handleChannelStatusChange(peer)
            peer.chan.onclose = handleChannelStatusChange(peer)
        }
    }

    function handleIceCandidateForOffer(peer: Peer) {
        return (event: RTCPeerConnectionIceEvent) => {
            console.log('Received ICE for offer: ' + JSON.stringify(event))

            if (event.candidate) {
                peer.conn.addIceCandidate(event.candidate)
            }

            if (event.isTrusted) {
                setOffer({ id: peer.id, description: peer.conn.localDescription as RTCSessionDescriptionInit })
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
                setReceivedOffer({ id: peer.id, description: peer.conn.localDescription as RTCSessionDescriptionInit })
            }
        }
    }

    function handleReceiveMessage(peer: Peer) {
        return (event: MessageEvent) => {
            console.log('Received message: ' + JSON.stringify(event))

            if (event.isTrusted) {
                const message: Message = JSON.parse(event.data)
                message.sentOrReceived = 'received'

                peer.messages = [...(peer.messages || []), message]
                forceUpdate()
            }
        }
    }

    function handleOnNegotiationNeeded(peer: Peer) {
        return (event: Event) => {
            console.log('Received negotiation needed: ' + JSON.stringify(event))
        }
    }
}
