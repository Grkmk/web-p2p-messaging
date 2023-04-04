import React, {useState, FormEvent, Component} from 'react'
import styles from './Modal.module.scss'

interface Props {
    onSubmitUsername: (e: FormEvent<HTMLFormElement>) => void
}

export default function ModalContent(props: Props) {
    return (
        <div className={styles.modal}>
            <form method="post" className={styles.modalForm} onSubmit={e => props.onSubmitUsername(e)}>
                <label className={styles.modalLabel}>
                    Please enter a username:
                    <input type="text" name="usernameField" />
                    <input type="submit" name="submitField" value="Submit"/>
                </label>
            </form>
        </div>
    )
}