import styles from './ReceiveOfferModal.module.scss'
import { Peer, Signal, createPeerFromOffer } from '../connection'
import { Modal } from './Modal'
import { useState } from 'react'

interface Props {
    onCreatePeer: (peer: Peer) => void
    onChange: () => void
}

export function ReceiveOfferModal(props: Props) {
    const [answer, setAnswer] = useState<Signal | null>()
    const [loading, setLoading] = useState<boolean>(false)

    return (
        <Modal
            render={openModal => <button onClick={openModal}>Receive invite</button>}
            onClose={() => {
                setAnswer(null)
                setLoading(false)
            }}
            renderModal={() => (
                <div>
                    <p>Paste the received invite into the field below</p>
                    {answer ? (
                        <div>
                            <p>{JSON.stringify(answer)}</p>
                            <button onClick={handleCopyToClipboard}>Copy offer to clipboard</button>
                        </div>
                    ) : (
                        <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleReceiveOffer(e)}>
                            <textarea className={styles.textarea} autoComplete="off" rows={10} name="offer" />
                            {loading ? (
                                <p>Processing invite, please wait...</p>
                            ) : (
                                <div>
                                    <button type="submit">Receive invite</button>
                                </div>
                            )}
                        </form>
                    )}
                </div>
            )}
        />
    )

    async function handleReceiveOffer(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        const offer: Signal = JSON.parse(e.currentTarget.offer.value)
        const peer = await createPeerFromOffer(offer, setAnswer, props.onChange)

        props.onCreatePeer(peer)
        setLoading(false)
    }

    async function handleCopyToClipboard() {
        if (!answer) {
            return
        }

        await navigator.clipboard.writeText(JSON.stringify(answer))
    }
}
