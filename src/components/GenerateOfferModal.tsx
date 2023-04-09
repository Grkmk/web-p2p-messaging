import styles from './GenerateOfferModal.module.scss'
import { Peer, Signal, createPeerToOffer } from 'connection'
import { useState } from 'react'
import { Modal } from './Modal'

interface Props {
    onChange: () => void
    onCreatePeer: (peer: Peer) => void
}

export function GenerateOfferModal(props: Props) {
    const [offer, setOffer] = useState<Signal | null>()

    return (
        <Modal
            renderModal={() => (
                <div>
                    <p className={styles.offer}>{offer ? JSON.stringify(offer) : 'Generating offer, please wait...'}</p>
                    <button onClick={handleCopyToClipboard}>Copy offer to clipboard</button>
                </div>
            )}
            onClose={() => setOffer(null)}
            render={openModal => <button onClick={handleOpenModal(openModal)}>Invite</button>}
        />
    )

    async function handleCopyToClipboard() {
        if (!offer) {
            return
        }

        await navigator.clipboard.writeText(JSON.stringify(offer))
    }

    function handleOpenModal(openModal: () => void) {
        return async (e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault()
            openModal()

            const peer = await createPeerToOffer(setOffer, props.onChange)
            props.onCreatePeer(peer)
        }
    }
}
