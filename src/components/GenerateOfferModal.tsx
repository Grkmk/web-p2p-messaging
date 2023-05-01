import styles from './GenerateOfferModal.module.scss'
import { Peer, Signal, createPeerToOffer } from 'connection'
import { useState } from 'react'
import { Modal } from './Modal'

interface Props {
    onChange: () => void
    onCreatePeer: (peer: Peer) => void
}

/**
 * A modal component that allows the user to generate and copy a WebRTC offer for inviting a peer. The invited peer will be stored with the user provided alias.
 * @param {Object} props - The props object that contains the following properties:
 *   - onChange {function}     - A callback function to be invoked when the state of a peer changes.
 *   - onCreatePeer {function} - A callback function to be invoked when a new peer is created.
 * @returns {JSX.Element} A React element representing the modal component.
 */
export function GenerateOfferModal(props: Props) {
    const [offer, setOffer] = useState<Signal | null>()
    const [providedName, setProvidedName] = useState(false)

    return (
        <Modal
            renderModal={() => <div>{providedName ? renderOffer() : renderTempNameForm()}</div>}
            onClose={() => {
                setOffer(null)
                setProvidedName(false)
            }}
            render={openModal => <button onClick={handleOpenModal(openModal)}>Invite</button>}
        />
    )

    /**
     * Requirements (3.1.8, 3.1.9)
     */
    function renderOffer() {
        if (!offer) {
            return <p>Generating offer, please wait...</p>
        }

        return (
            <>
                <p className={styles.offer}>{JSON.stringify(offer)}</p>
                <button onClick={handleCopyToClipboard}>Copy offer to clipboard</button>
            </>
        )
    }

    /**
     * (Requirements 3.1.5, 3.1.6)
     */
    function renderTempNameForm() {
        return (
            <form onSubmit={e => handleSubmit(e)}>
                <div>
                    <p>
                        Provide a temporary name for the peer. Once the connection is established, the name will
                        automatically be set to the peer's actual name.
                    </p>
                </div>
                <input autoComplete="off" name="tempName" type="text" />
                <div>
                    <button type="submit">Generate invite offer</button>
                </div>
            </form>
        )
    }

    async function handleCopyToClipboard() {
        if (!offer) {
            return
        }

        await navigator.clipboard.writeText(JSON.stringify(offer))
    }

    function handleOpenModal(openModal: () => void) {
        return (e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault()
            e.stopPropagation()
            openModal()
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        e.stopPropagation()

        const tempName = e.currentTarget.tempName.value
        if (!tempName) {
            alert('Please provide a temporary name')
            return
        }

        setProvidedName(true)
        const peer = await createPeerToOffer(setOffer, props.onChange, tempName)
        props.onCreatePeer(peer)
    }
}
