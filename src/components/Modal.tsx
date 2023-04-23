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

/**
 * The Modal component renders a standardized modal dialog box with the specified content and optionally provides a way to submit the form data.
 * @param {Object} props - The props object that contains the following properties:
 *   - startOpen {boolean}       - A boolean that determines whether the modal is open or closed when the component is first rendered.
 *   - render {function}         - A function that returns a React element that triggers the opening of the modal.
 *   - hideCloseButton {boolean} - A boolean that determines whether to display the close button in the modal.
 *   - handleSubmit {function}   - A function that is called when the form is submitted.
 *   - renderModal {function}    - A function that returns the content to be displayed in the modal.
 *   - onClose {function}        - A function that is called when the modal is closed.
 * @returns {JSX.Element} A React element representing the Modal component.
 */
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
                                {props.handleSubmit ? (
                                    <form onSubmit={e => handleSubmit(e)}>
                                        <div className={styles.content}>{props.renderModal()}</div>
                                        <div className={styles.submitButton}>
                                            <button type="submit">Submit</button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className={styles.content}>{props.renderModal()}</div>
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
        props.onClose?.()
        setOpen(false)
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        props.handleSubmit?.(e)
        setOpen(false)
    }
}
