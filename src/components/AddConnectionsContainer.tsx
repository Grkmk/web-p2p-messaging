import { createPeerFromOffer, createPeerToOffer, Peer, Signal } from 'connection'
import { useState } from 'react'
import styles from './AddConnectionsContainer.module.scss'
import { GenerateOfferModal } from './GenerateOfferModal'
import { ReceiveOfferModal } from './ReceiveOfferModal'

interface Props {
    onChange: () => void
    onCreatePeer: (peer: Peer) => void
    getPeer: (peerId: string) => Peer
}

export function AddConnectionsContainer(props: Props) {
    const [offer, setOffer] = useState<Signal | null>()
    const [reveivedOffer, setReceivedOffer] = useState<Signal | null>()
    const [showReceiveOffer, setShowReceiveOffer] = useState(false)
    const [showGenerateOffer, setShowGenerateOffer] = useState(false)

    return (
        <div className={styles.container}>
            <button onClick={e => handleGenerateOffer(e)}>Invite</button>
            {showGenerateOffer && (
                <GenerateOfferModal offer={JSON.stringify(offer)} handleClose={e => setShowGenerateOffer(false)} />
            )}
            <button onClick={e => setShowReceiveOffer(true)}>Receive invite</button>
            {showReceiveOffer && (
                <ReceiveOfferModal
                    receivedOffer={reveivedOffer}
                    onSubmitForm={e => handleReceiveOffer(e)}
                    handleClose={e => setShowReceiveOffer(false)}
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
}
