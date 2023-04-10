import { createPortal } from 'react-dom'
import styles from './Modal.module.scss'
import React from 'react'

interface Props {
    onClose?: () => void
    handleSubmit?: (e: React.FormEvent<HTMLFormElement>) => void
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
                                <form onSubmit={e => handleSubmit(e)}>
                                    <div className={styles.content}>{props.renderModal()}</div>
                                    {props.handleSubmit && (
                                        <div className={styles.submitButton}>
                                            <button type="submit">Submit</button>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>,
                    document.querySelector('#root') as HTMLElement
                )}
        </>
    )

    function handleClose(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        props.onClose?.()
        setOpen(false)
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        props.handleSubmit?.(e)
        setOpen(false)
    }
}
