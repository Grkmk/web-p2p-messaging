import React, {useState, FormEvent, Component} from 'react'
import styles from './Modal.module.scss'

interface Props {
    onSubmitUsername: (e: FormEvent<HTMLFormElement>) => void
}

export default function ModalContent(props: Props) {
    return (
        <form method="post" className={styles.modalContent} onSubmit={e => props.onSubmitUsername(e)}>
            <label className={styles.modalLabel}>
                Please enter a username:
                <input type="text" name="usernameField" />
            </label>
            <input type="submit" name="submitField" value="Submit"/>
        </form>
    )
}