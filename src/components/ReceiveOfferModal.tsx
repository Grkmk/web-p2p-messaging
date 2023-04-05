import {FormEvent, useState} from "react"
import {createPortal} from "react-dom"
import styles from './Modal.module.scss'
import {Signal} from "../connection"

interface Props {
    onSubmitForm: (e: React.FormEvent<HTMLFormElement>) => void
    handleClose: (state: boolean) => void
    receivedOffer: Signal | null | undefined;
}

export function ReceiveOfferModal(props: Props) {
    return (
        <>
            {createPortal(
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => props.onSubmitForm(e)}>
                            <textarea name="offer" />
                            <button type="submit">Receive Offer</button>
                        </form>
                        <button onClick={e => props.handleClose(false)}>Close</button>
                        {props.receivedOffer && <div>{JSON.stringify(props.receivedOffer, null, 2)}</div>}
                    </div>
                </div>,
                document.body
            )}
        </>
    )
}