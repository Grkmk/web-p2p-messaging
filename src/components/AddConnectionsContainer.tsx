import { createPeerFromOffer, createPeerToOffer, Peer, receiveAnswer, Signal } from 'connection'
import { useState } from 'react'
import styles from './AddConnectionsContainer.module.scss'

interface Props {
    onChange: () => void
    onCreatePeer: (peer: Peer) => void
    getPeer: (peerId: string) => Peer
}

export function AddConnectionsContainer(props: Props) {
    const [offer, setOffer] = useState<Signal | null>()
    const [reveivedOffer, setReceivedOffer] = useState<Signal | null>()

    return (
        <div className={styles.addConnections}>
            {/* TODO: receive invite button (receive offer) */}
            {/* TODO: send invite button (create offer) */}

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
    )

    async function handleGenerateOffer(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()

        const peer = await createPeerToOffer(setOffer, props.onChange)
        props.onCreatePeer(peer)
    }

    async function handleReceiveOffer(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const offer: Signal = JSON.parse(e.currentTarget.offer.value)
        const peer = await createPeerFromOffer(offer, setReceivedOffer, props.onChange)

        props.onCreatePeer(peer)
    }

    async function handleAnswer(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const answer: Signal = JSON.parse(e.currentTarget.answer.value)
        const peer = props.getPeer(answer.id)

        await receiveAnswer(peer, answer)
    }
}
