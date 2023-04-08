import { createPortal } from 'react-dom'
import styles from './Modal.module.scss'

interface Props {
    offer: string
    handleClose: (state: boolean) => void
}

export function GenerateOfferModal(props: Props) {
    return (
        <>
            {createPortal(
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        {props.offer}
                        <button onClick={handleCopyToClipboard}>Copy offer to clipboard</button>
                        <button onClick={e => props.handleClose(false)}>Close</button>
                    </div>
                </div>,
                document.body
            )}
        </>
    )

    async function handleCopyToClipboard() {
        await navigator.clipboard.writeText(props.offer)
    }
}
