import styles from './ReceiveOfferModal.module.scss'
import { Peer, Signal, createPeerFromOffer, isOfSignalInterface } from '../connection'
import { Modal } from './Modal'
import { useState } from 'react'

interface Props {
    onCreatePeer: (peer: Peer) => void
    onChange: () => void
}

/**
 * A React functional component that allows user to input and submit the received offer from a peer to begin the signaling process.
 * @param {Object} props - The props object that contains the following properties:
 *   - onCreatePeer {function} - A callback function to create a new peer connection.
 *   - onChange {function}     - A callback function to be invoked when a peer's status changes.
 * @returns {JSX.Element} A React element representing the container component.
 */
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
                    {answer ? (
                        <div>
                            <p>Please copy the below answer and pass it to the peer:</p>
                            <p>{JSON.stringify(answer)}</p>
                            <button onClick={handleCopyToClipboard}>Copy offer to clipboard</button>
                        </div>
                    ) : (
                        <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleReceiveOffer(e)}>
                            <p>Paste the received invite into the field below</p>
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

        let offer: Signal
        try {
            offer = JSON.parse(e.currentTarget.offer.value)
            if (!isOfSignalInterface(offer)) {
                throw new Error('Invalid offer')
            }
        } catch (e) {
            alert('Please input a valid offer')
            setLoading(false)
            return
        }

        let peer: Peer
        try {
            peer = await createPeerFromOffer(offer, setAnswer, props.onChange)
        } catch (e) {
            alert(`Failed to create peer from offer`)
            setLoading(false)
            return
        }

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
