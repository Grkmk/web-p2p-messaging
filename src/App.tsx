import styles from 'App.module.scss'
import { useState } from 'react'

interface Peer {
    conn: RTCPeerConnection
    chan?: RTCDataChannel
    enabled?: true
}

export function App() {
    const [offer, setOffer] = useState<RTCSessionDescriptionInit | null>()
    const [reveivedOffer, setReceivedOffer] = useState<RTCSessionDescriptionInit | null>()
    const peers: Peer[] = []

    return (
        <div className={styles.container}>
            <div>
                <button onClick={e => handleGenerateOffer(e)}>Generate Offer</button>
                {offer && <pre>{JSON.stringify(offer, null, 2)}</pre>}
                <form onSubmit={e => handleReceiveOffer(e)}>
                    <textarea name="offer" />
                    <button type="submit">Receive Offer</button>
                </form>
                {reveivedOffer && <pre>{JSON.stringify(reveivedOffer, null, 2)}</pre>}
            </div>

            {peers
                .filter(p => p.enabled)
                .map((p, i) => (
                    <div key={i}>
                        <div>
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
                                    disabled
                                />
                            </label>
                            <button id="sendButton" name="sendButton" disabled>
                                Send
                            </button>
                        </div>
                        <div id={`messageBox-${i}`}>
                            <p>Messages received:</p>
                        </div>
                    </div>
                ))}
        </div>
    )

    async function handleGenerateOffer(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()

        // Create the local connection and its event listeners
        const conn = new RTCPeerConnection()
        const peer: Peer = { conn }

        // Create the data channel and establish its event listeners
        peer.chan = conn.createDataChannel('chan' + peers.length)
        peer.chan.onopen = handleChannelStatusChange(peer, peers.length)
        peer.chan.onclose = handleChannelStatusChange(peer, peers.length)
        peer.chan.onmessage = handleReceiveMessage(peer, peers.length)

        // Set up the ICE candidate for the connection
        conn.onicecandidate = handleAddIceCandidate(peer)

        // Now create an offer to connect; this starts the process
        const desc = await conn.createOffer()
        await conn.setLocalDescription(desc)

        setOffer(desc)
        peers.push(peer)
    }

    async function handleReceiveOffer(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const remoteDesc = JSON.parse(e.currentTarget.offer.value)

        // Create the remote connection and its event listeners
        const conn = new RTCPeerConnection()
        const peer: Peer = { conn }
        conn.ondatachannel = receiveDataChannel(peer, peers.length)

        // Set up the ICE candidates for the two peers
        conn.onicecandidate = handleAddIceCandidate(peer)

        // Now create an offer to connect; this starts the process
        await conn.setRemoteDescription(remoteDesc)
        const answer = await conn.createAnswer()
        await conn.setLocalDescription(answer)

        setReceivedOffer(answer)
    }

    function handleChannelStatusChange(peer: Peer, index: number) {
        return (event: Event) => {
            console.log('Received channel status change: ' + JSON.stringify(event))

            if (peer.chan?.readyState === 'open') {
                peer.enabled = true
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

    function handleAddIceCandidate(peer: Peer) {
        return (event: RTCPeerConnectionIceEvent) => {
            console.log('Received ICE: ' + JSON.stringify(event))

            if (event.candidate) {
                peer.conn.addIceCandidate(event.candidate)
            }
        }
    }

    function handleReceiveMessage(peer: Peer, index: number) {
        return (event: MessageEvent) => {
            console.log('Received message: ' + JSON.stringify(event))

            const receiveBox = document.getElementById(`messageBox-${index}`)
            if (!receiveBox) {
                return console.error('No receive box found')
            }

            const el = document.createElement('p')
            const txtNode = document.createTextNode(event.data)

            el.appendChild(txtNode)
            receiveBox.appendChild(el)
        }
    }
}
