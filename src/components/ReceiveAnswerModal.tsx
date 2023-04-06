import {FormEvent, useState} from "react"
import {createPortal} from "react-dom"
import styles from './Modal.module.scss'

interface Props {
    onSubmitForm: (e: React.FormEvent<HTMLFormElement>) => void
    handleClose: (state: boolean) => void
}

export function ReceiveAnswerModal(props: Props) {
    return (
        <>
            {createPortal(
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <form onSubmit={e => props.onSubmitForm(e)}>
                            <textarea name="answer" />
                            <button type="submit">Receive Answer</button>
                        </form>
                        <button onClick={e => props.handleClose(false)}>Close</button>
                    </div>
                </div>,
                document.body
            )}
        </>
    )
}