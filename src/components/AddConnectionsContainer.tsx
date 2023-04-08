import { createPeerFromOffer, createPeerToOffer, Peer, receiveAnswer, Signal } from 'connection'
import { useState } from 'react'
import styles from './AddConnectionsContainer.module.scss'
import { GenerateOfferModal } from './GenerateOfferModal'
import { ReceiveOfferModal } from './ReceiveOfferModal'
import { ReceiveAnswerModal } from './ReceiveAnswerModal'

interface Props {
    onChange: () => void
    onCreatePeer: (peer: Peer) => void
    getPeer: (peerId: string) => Peer
}

export function AddConnectionsContainer(props: Props) {
    const [offer, setOffer] = useState<Signal | null>()
    const [reveivedOffer, setReceivedOffer] = useState<Signal | null>()
    const [showReceiveOffer, setShowReceiveOffer] = useState(false)
    const [showReceiveAnswer, setShowReceiveAnswer] = useState(false)
    const [showGenerateOffer, setShowGenerateOffer] = useState(false)

    return (
        <div className={styles.addConnections}>
            <button onClick={e => handleGenerateOffer(e)}>Generate Offer</button>
            {showGenerateOffer && (
                <GenerateOfferModal offer={JSON.stringify(offer)} handleClose={e => setShowGenerateOffer(false)} />
            )}
            <button onClick={e => setShowReceiveOffer(true)}>Receive Offer</button>
            {showReceiveOffer && (
                <ReceiveOfferModal
                    receivedOffer={reveivedOffer}
                    onSubmitForm={e => handleReceiveOffer(e)}
                    handleClose={e => setShowReceiveOffer(false)}
                />
            )}
            <button onClick={e => setShowReceiveAnswer(true)}>Receive Answer</button>
            {showReceiveAnswer && (
                <ReceiveAnswerModal
                    onSubmitForm={e => handleAnswer(e)}
                    handleClose={e => setShowReceiveAnswer(false)}
                />
            )}
        </div>
    )

    async function handleGenerateOffer(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()

        setShowGenerateOffer(true)

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
