import styles from 'App.module.scss'
import { createPeerFromOffer, createPeerToOffer, Peer, receiveAnswer, sendMessage, Signal } from 'connection'
import { useReducer, useState } from 'react'

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

        const peer = await createPeerToOffer(setOffer, forceUpdate)

        peers[peer.id] = peer
        forceUpdate()
    }

    async function handleReceiveOffer(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const offer: Signal = JSON.parse(e.currentTarget.offer.value)
        const peer = await createPeerFromOffer(offer, setReceivedOffer, forceUpdate)

        peers[peer.id] = peer
        forceUpdate()
    }

    async function handleAnswer(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const answer: Signal = JSON.parse(e.currentTarget.answer.value)
        const peer = peers[answer.id]

        await receiveAnswer(peer, answer)
    }

    function handleSendMessage(peer: Peer) {
        return (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            const message: string = e.currentTarget.message.value
            sendMessage(peer, message, forceUpdate)
        }
    }
}
