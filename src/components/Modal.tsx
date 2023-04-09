import { createPortal } from 'react-dom'
import styles from './Modal.module.scss'
import React from 'react'

interface Props {
    onClose?: () => void
    submit?: boolean
    render?: (openModal: () => void) => JSX.Element
    renderModal: () => React.ReactNode
    startOpen?: boolean
    hideCloseButton?: boolean
}

export function Modal(props: Props) {
    const [open, setOpen] = React.useState(props.startOpen)

    return (
        <>
            {props.render && props.render(() => setOpen(true))}
            {open &&
                createPortal(
                    <div className={styles.container}>
                        <div className={styles.modal}>
                            <div className={styles.modalContent}>
                                {!props.hideCloseButton && (
                                    <button className={styles.closeButton} onClick={handleClose}>
                                        X
                                    </button>
                                )}
                                <div className={styles.content}>{props.renderModal()}</div>
                                {props.submit && (
                                    <div className={styles.submitButton}>
                                        <button type="submit" onClick={handleClose}>
                                            Submit
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>,
                    document.querySelector('#root') as HTMLElement
                )}
        </>
    )

    function handleClose(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        setOpen(false)
        props.onClose?.()
    }
}
