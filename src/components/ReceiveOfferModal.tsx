import {FormEvent, useState} from "react"
import {createPortal} from "react-dom"
import styles from './Modal.module.scss'

interface Props {
    onSubmitForm: (e: FormEvent) => void
    handleClose: (state: boolean) => void
}

export function ReceiveOfferModal(props: Props) {
    return (
        <>
            {createPortal(
                <div className={styles.modal}>
                    <form onSubmit={e => props.onSubmitForm(e)}>
                        <textarea name="offer" />
                        <button type="submit">Receive Offer</button>
                        <button onClick={e => props.handleClose(false)}>Close</button>
                    </form>
                </div>,
                document.body
            )}
        </>
    )
}