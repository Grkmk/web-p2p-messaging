import {FormEvent, useState} from "react"
import {createPortal} from "react-dom"
import styles from './Modal.module.scss'

interface Props {
    onSubmitForm: (e: FormEvent) => void
    handleClose: (state: boolean) => void
}

export function ReceiveAnswerModal(props: Props) {
    return (
        <>
            {createPortal(
                <div className={styles.modal}>
                    <form onSubmit={e => props.onSubmitForm(e)}>
                        <textarea name="offer" />
                        <button type="submit">Receive Answer</button>
                        <button onClick={e => props.handleClose(false)}>Close</button>
                    </form>
                </div>,
                document.body
            )}
        </>
    )
}